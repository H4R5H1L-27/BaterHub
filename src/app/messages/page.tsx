'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Repeat, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowLeft,
  Star,
  ExternalLink
} from 'lucide-react';
import { ConversationItem, ChatMessage, UserSummary } from '@/lib/types';
import { formatRelativeTime, formatPrice } from '@/lib/utils';

function MessagesContent() {
  const searchParams = useSearchParams();
  const initialListingId = searchParams.get('listingId');
  const initialRecipientId = searchParams.get('recipientId');

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserSummary | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessageCount = useRef<number>(0);

  // 1. Fetch current user and conversations
  const fetchConversations = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const uData = await userRes.json();
        setCurrentUser(uData.user);
      }

      // If initialRecipientId is present in URL, ensure a conversation exists
      if (initialRecipientId) {
        try {
          const createRes = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipientId: initialRecipientId,
              listingId: initialListingId || undefined,
            }),
          });
          if (createRes.ok) {
            const cData = await createRes.json();
            if (cData.conversation) {
              setSelectedConversation(cData.conversation);
            }
          }
        } catch (e) {
          console.error('Failed to create/fetch direct conversation:', e);
        }
      }

      const res = await fetch('/api/conversations');
      if (res.ok) {
        const data = await res.json();
        const convList: ConversationItem[] = data.conversations || [];
        setConversations(convList);

        // If a specific conversation or recipient was targeted via query params
        if (convList.length > 0) {
          setSelectedConversation((current) => {
            if (current) return current;
            if (initialListingId || initialRecipientId) {
              const match = convList.find((c) =>
                (initialListingId && c.listing?.id === initialListingId) ||
                (initialRecipientId && (c.participantA.id === initialRecipientId || c.participantB.id === initialRecipientId))
              );
              return match || convList[0];
            }
            return convList[0];
          });
        }
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [initialRecipientId, initialListingId]);

  // 2. Poll messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?conversationId=${selectedConversation.id}`);
        if (res.ok) {
          const data = await res.json();
          const incoming = data.messages || [];
          setMessages((prev) => {
            // Only update state if message IDs or count changed, preventing unnecessary re-renders & scroll jumps
            if (prev.length === incoming.length && prev[prev.length - 1]?.id === incoming[incoming.length - 1]?.id) {
              return prev;
            }
            return incoming;
          });
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [selectedConversation?.id]);

  // Scroll to bottom inside the chat container ONLY when new messages arrive, NEVER scrolling the window
  useEffect(() => {
    if (!chatContainerRef.current) return;
    const container = chatContainerRef.current;
    if (messages.length > previousMessageCount.current) {
      // Internal scroll only
      container.scrollTop = container.scrollHeight;
    }
    previousMessageCount.current = messages.length;
  }, [messages.length, selectedConversation?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedConversation) return;

    const text = newMessageText.trim();
    setNewMessageText('');
    setSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          content: text,
          messageType: 'TEXT',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv: ConversationItem) => {
    if (!currentUser) return conv.participantB;
    return conv.participantA.id === currentUser.id ? conv.participantB : conv.participantA;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)]">
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden h-full flex flex-col md:flex-row">
        
        {/* Left Sidebar: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col h-full bg-slate-50/50 flex-shrink-0">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span>Negotiation Chats</span>
            </h2>
            <p className="text-xs text-gray-700 mt-0.5">Live peer-to-peer offers and swaps</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 bg-gray-200/60 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-700">
                No conversations yet. When you make an offer or propose a barter, your chat thread will start here.
              </div>
            ) : (
              conversations.map((conv) => {
                const partner = getOtherParticipant(conv);
                const isSelected = selectedConversation?.id === conv.id;
                const latestMsg = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-white border-l-4 border-indigo-600 shadow-sm'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={partner.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-gray-200 flex-shrink-0"
                      />
                      {partner.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-900 truncate">{partner.name}</h4>
                        <span className="text-[10px] text-gray-700">
                          {formatRelativeTime(conv.lastMessageAt)}
                        </span>
                      </div>

                      {conv.listing && (
                        <p className="text-[11px] font-semibold text-indigo-600 truncate mt-0.5">
                          📌 {conv.listing.title}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 truncate mt-1">
                        {latestMsg?.content || 'Start negotiating...'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Area: Active Chat Window */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col h-full bg-white">
            
            {/* Chat Top Header */}
            {(() => {
              const partner = getOtherParticipant(selectedConversation);
              return (
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={partner.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link href={`/profile/${partner.id}`} className="font-bold text-sm text-gray-900 hover:text-indigo-600">
                          {partner.name}
                        </Link>
                        {partner.isVerified && <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                        <span className="text-xs text-amber-500 font-semibold">★ {partner.reputationScore.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-gray-700">
                        {partner.city}, {partner.state} • {partner.avgResponseTime || 'Replies quickly'}
                      </p>
                    </div>
                  </div>

                  {selectedConversation.listing && (
                    <Link
                      href={`/listings/${selectedConversation.listing.id}`}
                      className="hidden sm:flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-gray-700 transition-colors"
                    >
                      <span className="truncate max-w-[150px]">{selectedConversation.listing.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </Link>
                  )}
                </div>
              );
            })()}

            {/* Meetup Safety Banner */}
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 text-[11px] text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                Never share bank PINs or payment passwords. Meet in public locations.
              </span>
              <Link href="/offers" className="font-bold text-amber-900 underline">
                View All Offers
              </Link>
            </div>

            {/* Messages Scroll Area - internally scrollable only */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
              {messages.map((msg) => {
                const isMe = currentUser ? msg.senderId === currentUser.id : msg.sender.name === 'Alex Turner';
                let metadataObj: any = null;
                if (msg.metadata) {
                  try {
                    metadataObj = typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata;
                  } catch {}
                }

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    {/* Timestamp & Name */}
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-gray-700 font-medium">
                      <span>{msg.sender.name}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(msg.createdAt)}</span>
                    </div>

                    {/* Standard Text or Action Cards */}
                    {msg.messageType === 'CASH_OFFER_CARD' ? (
                      <div className="w-full max-w-sm p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            <span>Cash Offer Negotiation</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
                            {metadataObj?.status || 'OFFER'}
                          </span>
                        </div>
                        <p className="text-xl font-black text-gray-900">
                          {formatPrice(metadataObj?.amount)}
                        </p>
                        {metadataObj?.counterAmount && (
                          <p className="text-xs font-bold text-amber-700">
                            Countered at: {formatPrice(metadataObj.counterAmount)}
                          </p>
                        )}
                        <p className="text-xs text-gray-600">{msg.content}</p>
                        <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                          <Link href="/offers" className="text-xs font-bold text-emerald-700 hover:underline">
                            Respond in Offers Hub →
                          </Link>
                        </div>
                      </div>
                    ) : msg.messageType === 'BARTER_PROPOSAL_CARD' ? (
                      <div className="w-full max-w-sm p-4 rounded-2xl bg-purple-50 border border-purple-200 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                            <Repeat className="w-4 h-4 text-purple-600" />
                            <span>Barter Swap Proposal</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase">
                            {metadataObj?.status || 'PROPOSED'}
                          </span>
                        </div>
                        {metadataObj?.offeredItemTitles && (
                          <div className="text-xs text-gray-800">
                            <span className="font-semibold text-purple-950">Offered Items:</span>
                            <ul className="list-disc list-inside mt-0.5 font-medium">
                              {metadataObj.offeredItemTitles.map((t: string, i: number) => (
                                <li key={i} className="truncate">{t}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {metadataObj?.cashTopUp > 0 && (
                          <p className="text-xs font-bold text-emerald-700">
                            + ${metadataObj.cashTopUp} Cash Top-Up
                          </p>
                        )}
                        {metadataObj?.exchangeCode && (
                          <div className="p-2 bg-purple-100 rounded-lg text-xs font-mono font-bold text-purple-900 flex justify-between">
                            <span>Code:</span>
                            <span>{metadataObj.exchangeCode}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-purple-100 flex items-center justify-between">
                          <Link href="/offers" className="text-xs font-bold text-purple-700 hover:underline">
                            Manage Proposal in Offers Hub →
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white flex items-center gap-3">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type a message or discuss meetup location..."
                className="flex-1 px-4 py-2.5 bg-gray-100 focus:bg-white border border-transparent focus:border-indigo-500 rounded-2xl text-xs text-gray-900 focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={sending || !newMessageText.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl disabled:opacity-40 transition-all shadow-md flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
            <p className="font-bold text-sm text-gray-700">Select a conversation to start chatting</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function MessagesChatPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-gray-500">Loading negotiation chats...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
