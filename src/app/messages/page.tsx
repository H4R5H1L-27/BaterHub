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
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-surface-container-low rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-outline">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 text-outline/50" />
                <p className="text-xs font-bold text-on-surface">No negotiations started yet</p>
                <p className="text-[11px] text-outline mt-1">Browse catalog items and propose a barter to start chatting.</p>
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
                    className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-primary-fixed/25 border-l-4 border-primary'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={partner.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-outline-variant/30"
                      />
                      {partner.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-surface-container-lowest rounded-full p-0.5 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-on-surface truncate">{partner.name}</h4>
                        <span className="text-[10px] text-outline">
                          {formatRelativeTime(conv.lastMessageAt)}
                        </span>
                      </div>

                      {conv.listing && (
                        <p className="text-[11px] font-semibold text-primary truncate mt-0.5">
                          📌 {conv.listing.title}
                        </p>
                      )}

                      <p className="text-xs text-outline truncate mt-1">
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
          <div className="flex-1 flex flex-col h-full bg-surface-container-lowest">
            
            {/* Chat Top Header */}
            {(() => {
              const partner = getOtherParticipant(selectedConversation);
              return (
                <div className="p-4 border-b border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-1 rounded-full hover:bg-surface-container text-on-surface"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <img
                      src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={partner.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-outline-variant/30"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Link href={`/profile/${partner.id}`} className="font-bold text-sm text-on-surface hover:text-primary transition-colors">
                          {partner.name}
                        </Link>
                        {partner.isVerified && <ShieldCheck className="w-4 h-4 text-primary" />}
                        <span className="text-xs text-tertiary font-bold">★ {partner.reputationScore.toFixed(1)}</span>
                      </div>
                      <p className="text-[11px] text-outline">
                        {partner.city}, {partner.state} • {partner.avgResponseTime || 'Replies promptly'}
                      </p>
                    </div>
                  </div>

                  {selectedConversation.listing && (
                    <Link
                      href={`/listings/${selectedConversation.listing.id}`}
                      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-xs font-semibold text-on-surface transition-colors"
                    >
                      <span className="truncate max-w-[140px]">{selectedConversation.listing.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-outline" />
                    </Link>
                  )}
                </div>
              );
            })()}

            {/* Meetup Safety Banner */}
            <div className="px-4 py-2 bg-tertiary-fixed/30 border-b border-tertiary/20 text-[11px] text-on-tertiary-fixed flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-tertiary flex-shrink-0" />
                Never send prepaid wire transfers. Always use in-person meetup verification codes.
              </span>
              <Link href="/offers" className="font-bold text-primary underline">
                Offers Hub
              </Link>
            </div>

            {/* Messages Scroll Area */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-surface/50">
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
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-outline font-medium">
                      <span>{msg.sender.name}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(msg.createdAt)}</span>
                    </div>

                    {/* Standard Text or Action Cards */}
                    {msg.messageType === 'CASH_OFFER_CARD' ? (
                      <div className="w-full max-w-sm p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-on-surface font-bold text-xs">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            <span>Cash Buyout Offer</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase">
                            {metadataObj?.status || 'OFFER'}
                          </span>
                        </div>
                        <p className="text-xl font-extrabold text-on-surface">
                          {formatPrice(metadataObj?.amount)}
                        </p>
                        {metadataObj?.counterAmount && (
                          <p className="text-xs font-bold text-tertiary">
                            Countered at: {formatPrice(metadataObj.counterAmount)}
                          </p>
                        )}
                        <p className="text-xs text-outline">{msg.content}</p>
                        <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
                          <Link href="/offers" className="text-xs font-bold text-primary hover:underline">
                            Respond in Offers Hub →
                          </Link>
                        </div>
                      </div>
                    ) : msg.messageType === 'BARTER_PROPOSAL_CARD' ? (
                      <div className="w-full max-w-sm p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-on-surface font-bold text-xs">
                            <Repeat className="w-4 h-4 text-primary" />
                            <span>Barter Swap Proposal</span>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase">
                            {metadataObj?.status || 'PROPOSED'}
                          </span>
                        </div>
                        {metadataObj?.offeredItemTitles && (
                          <div className="text-xs text-on-surface">
                            <span className="font-bold text-primary">Offered Items:</span>
                            <ul className="list-disc list-inside mt-0.5 font-medium text-on-surface-variant">
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
                          <div className="p-2 bg-primary-fixed rounded-xl text-xs font-mono font-bold text-primary flex justify-between">
                            <span>PIN Code:</span>
                            <span>{metadataObj.exchangeCode}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between">
                          <Link href="/offers" className="text-xs font-bold text-primary hover:underline">
                            Manage Proposal in Offers Hub →
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-primary text-white rounded-tr-sm shadow-sm'
                            : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface rounded-tl-sm shadow-sm'
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
            <form onSubmit={handleSendMessage} className="p-3.5 border-t border-outline-variant/30 bg-surface-container-lowest flex items-center gap-2.5">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type a message or discuss meetup location..."
                className="flex-1 px-4 py-2.5 bg-surface-container-low focus:bg-white border border-transparent focus:border-primary rounded-full text-xs text-on-surface focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={sending || !newMessageText.trim()}
                className="p-2.5 bg-primary hover:bg-primary-container text-white rounded-full disabled:opacity-40 transition-all shadow-lift shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-outline">
            <MessageSquare className="w-12 h-12 mb-3 text-outline/40" />
            <p className="font-bold text-sm text-on-surface">Select a conversation to start chatting</p>
            <p className="text-xs text-outline mt-1">Negotiate swap terms and coordinate safe campus meetups</p>
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
