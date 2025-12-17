"use client";

import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Send } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    type: "linkedin",
    name: "Marcus Chen",
    avatar: "/testimonials/t1.png",
    useImage: true,
    title: "Full-Time Trader",
    badges: ["💰 6-Figure Club", "⚡ Early Adopter"],
    postedIn: "Success Stories",
    timeAgo: "2d",
    heading: "From $3K to $47K in 8 months with APEX",
    content: "I was skeptical about trading bots until I found APEX. The AI adaptation is insane - it actually learns from market conditions. My account grew from $3,000 to $47,000 in 8 months. The best part? I haven't touched my charts in weeks. Just let it run.",
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    type: "instagram",
    name: "Sarah Mitchell",
    avatar: "/testimonials/t2.png",
    useImage: true,
    username: "@sarahtradesforex",
    timeAgo: "5h",
    content: "Woke up to this 🤯 APEX hit another 12% week while I was literally sleeping. No more staring at charts at 3 AM. No more revenge trading. Just consistent gains. Best $999 I ever spent 💸✨",
    likes: 892,
    comments: 67,
    image: true,
  },
  {
    id: 3,
    type: "linkedin",
    name: "James Rodriguez",
    avatar: "/testimonials/t3.png",
    useImage: true,
    title: "Former Day Trader",
    badges: ["🎯 Profitable", "🔥 Top Performer"],
    postedIn: "APEX Protocol Community",
    timeAgo: "1d",
    heading: "Finally profitable after 2 years of losses",
    content: "I spent 2 years losing money trying to 'master' forex. Bought every course, joined every signal group. Lost $18K. APEX changed everything. 4 months in, I'm up $23,000. The emotion removal is what made the difference. I can't panic sell or FOMO buy anymore.",
    likes: 456,
    comments: 89,
  },
  {
    id: 4,
    type: "instagram",
    name: "Tyler Brooks",
    avatar: "/testimonials/t4.png",
    useImage: true,
    username: "@tylersmoney",
    timeAgo: "1d",
    content: "Month 3 with APEX: +$14,200 profit 📈 Started with $5K, now sitting at $19,200. The bot traded through Tokyo, London, and NY sessions while I was at my day job. This is actually working. Not getting rich overnight, but consistent AF 💪",
    likes: 1203,
    comments: 134,
  },
  {
    id: 5,
    type: "linkedin",
    name: "Kim Zhang",
    useImage: false,
    title: "Software Engineer → Trader",
    badges: ["🚀 APEX Elite", "💎 Diamond Hands"],
    postedIn: "Trading Wins",
    timeAgo: "4d",
    heading: "Engineering background + APEX = Perfect match",
    content: "As a developer, I appreciate how APEX is built. The machine learning isn't just marketing fluff - you can see it adapt in real-time. Started with $10K in January, crossed $40K last week. The risk management alone is worth the price. It literally won't let you blow your account.",
    likes: 678,
    comments: 91,
  },
  {
    id: 6,
    type: "instagram",
    name: "Alex Rivera",
    useImage: false,
    username: "@alexcrypto",
    timeAgo: "3h",
    content: "Remember when I was crying about losing $6K on a revenge trade in June? 😅 APEX has made that back plus $11K more. The bot doesn't have emotions. That's literally the whole game. Wish I found this 2 years ago 🙏",
    likes: 445,
    comments: 52,
  },
  {
    id: 7,
    type: "linkedin",
    name: "Jordan Taylor",
    useImage: false,
    title: "Single Parent | Part-Time Trader",
    badges: ["👨‍👧 Work-Life Balance", "✅ Verified"],
    postedIn: "Success Stories",
    timeAgo: "6d",
    heading: "Trading while raising two kids? APEX made it possible.",
    content: "I'm a single dad with two kids under 5. I don't have time to watch charts. APEX runs 24/7 while I'm changing diapers and working my 9-5. Up $8,900 in 5 months from a $4K start. It's not life-changing money yet, but it's changing my life. Finally seeing a path out of paycheck-to-paycheck.",
    likes: 892,
    comments: 156,
  },
  {
    id: 8,
    type: "instagram",
    name: "Mia Chen",
    useImage: false,
    username: "@miatrades",
    timeAgo: "12h",
    content: "First time posting my results publicly but... 6 weeks with APEX: +$7,340 from $3,000 starting 🎊 The private Discord community is GOLD too. Everyone's actually helpful, not toxic like other trading groups. Upgrade to Elite was 100% worth it 🔥",
    likes: 667,
    comments: 78,
  },
  {
    id: 9,
    type: "linkedin",
    name: "David Park",
    useImage: false,
    title: "Retired Teacher",
    badges: ["🏆 Consistent Trader", "📚 Educator"],
    postedIn: "Wins",
    timeAgo: "3d",
    heading: "My retirement just got a lot more comfortable",
    content: "I'm 61, retired last year, and worried about my savings. Started APEX in March with $15K (money I could afford to risk). Sitting at $31,400 today. The customer support walked me through setup on a video call - incredibly patient. This isn't a get-rich-quick scheme. It's a tool that actually works if you're smart about it.",
    likes: 543,
    comments: 67,
  },
  {
    id: 10,
    type: "instagram",
    name: "Chris Martinez",
    useImage: false,
    username: "@chrismoneymoves",
    timeAgo: "8h",
    content: "Just passed $50K total profit with APEX 🎯💰 Started in December with $8K. Yes, it's real. No, I don't work for them. The bot hit 68% win rate this month. My manual trading? Was like 43% 💀 Let the AI do its thing.",
    likes: 1456,
    comments: 203,
  },
  {
    id: 11,
    type: "linkedin",
    name: "Rachel Thompson",
    useImage: false,
    title: "Nurse | Forex Trader",
    badges: ["💊 Healthcare Hero", "📈 Profitable"],
    postedIn: "APEX Success",
    timeAgo: "1w",
    heading: "Night shifts don't stop APEX from trading",
    content: "Working 12-hour night shifts as an ER nurse doesn't leave much time for trading. APEX changed that. It trades while I'm saving lives, and I check my account during breaks. $6,200 profit in my first 3 months. The 30-day guarantee made it a no-brainer to try. So glad I did.",
    likes: 721,
    comments: 94,
  },
  {
    id: 12,
    type: "instagram",
    name: "Jake Wilson",
    useImage: false,
    username: "@jakewins",
    timeAgo: "1d",
    content: "Update: Month 7 with APEX. Account balance: $34,800 (started with $6K) 🚀 The skeptics called it a scam. The same people are still watching YouTube trading tutorials and losing money. Meanwhile, the bot is printing while I'm at the gym 💪😎",
    likes: 934,
    comments: 112,
  },
  {
    id: 13,
    type: "linkedin",
    name: "Emily Watson",
    useImage: false,
    title: "College Student",
    badges: ["🎓 Student Success", "🌟 Rising Star"],
    postedIn: "Wins",
    timeAgo: "2d",
    heading: "Paying off student loans with APEX profits",
    content: "I'm 22, in my final year of college, drowning in $45K student debt. Started APEX with $2,500 I saved from my part-time job. 4 months later: $8,900 in my account. I'm putting every dollar of profit toward my loans. At this rate, I'll be debt-free way sooner than expected. This is literally changing my life trajectory.",
    likes: 1234,
    comments: 187,
  },
  {
    id: 14,
    type: "instagram",
    name: "Ryan Foster",
    useImage: false,
    username: "@ryanfx",
    timeAgo: "6h",
    content: "People ask 'is APEX legit?' - bro I made $19K in 5 months. That answer your question? 😂 The bot doesn't care about your feelings. It just executes the strategy. No tilt. No fear. No greed. That's the edge. Simple as that. 📊✅",
    likes: 756,
    comments: 89,
  },
  {
    id: 15,
    type: "linkedin",
    name: "Nicole Adams",
    useImage: false,
    title: "Corporate Dropout | Full-Time Trader",
    badges: ["🔥 Elite Member", "💸 $10K/Month"],
    postedIn: "Success Stories",
    timeAgo: "5d",
    heading: "I quit my corporate job. APEX made it possible.",
    content: "Left my $85K/year corporate job in August. Everyone thought I was crazy. My APEX account went from $20K to $94K in 9 months. I'm now making more than my salary ever was, working 2 hours a day instead of 10. The freedom is priceless. Yes, I was terrified. Yes, it was worth it. Not financial advice, but it worked for me.",
    likes: 2103,
    comments: 312,
  },
];

export default function SocialProofPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Real Results from Real Traders</h1>
          <p className="text-lg text-gray-600">APEX Protocol is changing lives. Here&apos;s what our community is saying.</p>
        </div>

        {/* Testimonials Grid */}
        {testimonials.map((testimonial) => (
          <div key={testimonial.id}>
            {testimonial.type === "linkedin" ? (
              <LinkedInPost
                name={testimonial.name}
                avatar={testimonial.avatar}
                useImage={testimonial.useImage}
                title={testimonial.title!}
                badges={testimonial.badges!}
                postedIn={testimonial.postedIn!}
                timeAgo={testimonial.timeAgo}
                heading={testimonial.heading!}
                content={testimonial.content}
                likes={testimonial.likes}
                comments={testimonial.comments}
              />
            ) : (
              <InstagramPost
                name={testimonial.name}
                avatar={testimonial.avatar}
                useImage={testimonial.useImage}
                username={testimonial.username!}
                timeAgo={testimonial.timeAgo}
                content={testimonial.content}
                likes={testimonial.likes}
                comments={testimonial.comments}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface LinkedInPostProps {
  name: string;
  avatar?: string;
  useImage?: boolean;
  title: string;
  badges: string[];
  postedIn: string;
  timeAgo: string;
  heading: string;
  content: string;
  likes: number;
  comments: number;
}

function LinkedInPost({
  name,
  avatar,
  useImage = false,
  title,
  badges,
  postedIn,
  timeAgo,
  heading,
  content,
  likes,
  comments,
}: LinkedInPostProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Generate initials from name
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate color from name
  const getColorFromName = (fullName: string) => {
    const colors = [
      '#0f7a5c', '#8b7355', '#d4a5a5', '#6366f1', '#8b5cf6',
      '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'
    ];
    const index = fullName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full bg-white border border-[#d4d4d494] shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            {/* Profile Picture */}
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
              {useImage && avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: getColorFromName(name) }}
                >
                  {getInitials(name)}
                </div>
              )}
            </div>

            {/* User Info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-semibold text-[15px] text-[#000000de] leading-tight">{name}</h3>
              </div>
              <p className="text-xs text-[#00000099] mb-1">{title}</p>
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                {badges.map((badge: string, i: number) => (
                  <span
                    key={i}
                    className={`px-2 py-0.5 text-xs font-medium rounded ${
                      i % 2 === 0
                        ? "bg-[#fef3c7] text-[#92400e]"
                        : "bg-[#d1fae5] text-[#065f46]"
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#00000099]">Posted in {postedIn}</p>
            </div>
          </div>

          {/* Right Side - Time and Actions */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#00000099]">{timeAgo}</span>
            <button className="p-1 hover:bg-[#0000000a] rounded transition-colors">
              <Bookmark className="w-5 h-5 text-[#00000099]" />
            </button>
            <button className="p-1 hover:bg-[#0000000a] rounded transition-colors">
              <Share2 className="w-5 h-5 text-[#00000099]" />
            </button>
            <button className="p-1 hover:bg-[#0000000a] rounded transition-colors">
              <MoreHorizontal className="w-5 h-5 text-[#00000099]" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <h2 className="text-[20px] font-semibold text-[#000000e6] mb-2 leading-tight">
          {heading}
        </h2>
        <p className="text-[14px] text-[#000000e6] leading-[1.5]">{content}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5] mx-4"></div>

      {/* Engagement Section */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center -space-x-1">
              <div className="w-5 h-5 rounded-full bg-[#0f7a5c] border-2 border-white"></div>
              <div className="w-5 h-5 rounded-full bg-[#8b7355] border-2 border-white"></div>
              <div className="w-5 h-5 rounded-full bg-[#d4a5a5] border-2 border-white"></div>
            </div>
            <span className="text-xs text-[#00000099]">
              {likes} likes • {comments} comments
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#e5e5e5] mx-4"></div>

      {/* Action Buttons */}
      <div className="px-2 py-1.5 flex items-center">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-[#0000000a] rounded-lg transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isLiked ? "text-[#df4a32] fill-[#df4a32]" : "text-[#00000099]"
            }`}
          />
          <span className="text-sm font-semibold text-[#00000099]">Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-[#0000000a] rounded-lg transition-colors">
          <MessageCircle className="w-5 h-5 text-[#00000099]" />
          <span className="text-sm font-semibold text-[#00000099]">Comment</span>
        </button>
      </div>
    </div>
  );
}

interface InstagramPostProps {
  name: string;
  avatar?: string;
  useImage?: boolean;
  username: string;
  timeAgo: string;
  content: string;
  likes: number;
  comments: number;
}

function InstagramPost({ name, avatar, useImage = false, username, timeAgo, content, likes, comments }: InstagramPostProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Generate initials from name
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate color from name
  const getColorFromName = (fullName: string) => {
    const colors = [
      '#0f7a5c', '#8b7355', '#d4a5a5', '#6366f1', '#8b5cf6',
      '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'
    ];
    const index = fullName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full bg-white border border-[#dbdbdb] shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] p-[2px]">
            <div className="w-full h-full rounded-full bg-white p-[2px]">
              {useImage && avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold text-xs"
                  style={{ backgroundColor: getColorFromName(name) }}
                >
                  {getInitials(name)}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div>
            <p className="font-semibold text-sm text-black">{name}</p>
            <p className="text-xs text-[#737373]">{username}</p>
          </div>
        </div>

        {/* Right Side */}
        <button className="p-1">
          <MoreHorizontal className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-[15px] text-black leading-[1.5]">{content}</p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#efefef] mx-4"></div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsLiked(!isLiked)}>
              <Heart
                className={`w-7 h-7 transition-all ${
                  isLiked
                    ? "text-[#ed4956] fill-[#ed4956] scale-110"
                    : "text-black hover:text-gray-500"
                }`}
              />
            </button>
            <button>
              <MessageCircle className="w-7 h-7 text-black hover:text-gray-500" />
            </button>
            <button>
              <Send className="w-7 h-7 text-black hover:text-gray-500" />
            </button>
          </div>
          <button>
            <Bookmark className="w-6 h-6 text-black hover:text-gray-500" />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-2 text-black/80">{likes.toLocaleString()} likes</p>

        {/* Comments */}
        <button className="text-sm text-[#737373]">
          View all {comments} comments
        </button>

        {/* Time */}
        <p className="text-xs text-[#737373] uppercase mt-2">{timeAgo} ago</p>
      </div>
    </div>
  );
}
