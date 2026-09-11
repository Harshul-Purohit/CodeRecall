import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroTelemetry } from './components/HeroTelemetry';
import { PatternFilter } from './components/PatternFilter';
import { ProblemCard, ProblemCardData } from './components/ProblemCard';
import { StatusBar } from './components/StatusBar';

const INITIAL_CARDS: ProblemCardData[] = [
  {
    id: 'card-1',
    number: '#001',
    title: 'Two Sum',
    pattern: 'Hashing',
    patternId: 'hashing',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    dueStatus: 'Due Today',
    lastHistory: 'Last: Solved with Hints',
    sm2Interval: '3 days',
    sm2Ef: '2.5',
    defaultExpandedTray: 'hints',
    hints: [
      'Use a hash map to store array values and their corresponding indices as you iterate through nums.',
      'For each element nums[i], calculate the required complement = target - nums[i].',
      'Check if complement exists in the hash map. If present, return [map[complement], i].'
    ],
    codeSolution: {
      language: 'Python 3',
      code: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      explanation: 'Optimal O(n) time complexity with O(n) space complexity using single-pass Hash Table.'
    }
  },
  {
    id: 'card-2',
    number: '#003',
    title: 'Longest Substring Without Repeating Characters',
    pattern: 'Sliding Window',
    patternId: 'sliding-window',
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    difficulty: 'Medium',
    dueStatus: 'Due Today',
    lastHistory: 'Last: Solved Without Help',
    sm2Interval: '7 days',
    sm2Ef: '2.6',
    hints: [
      'Maintain a dynamic sliding window [left, right] and track character last-seen indices in a map.',
      'When encountering a duplicate character, jump left pointer to max(left, last_seen[char] + 1).',
      'At each iteration step, update max_length = max(max_length, right - left + 1).'
    ],
    codeSolution: {
      language: 'Python 3',
      code: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    left = max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      explanation: 'Optimal O(n) sliding window using last-seen character mapping to avoid rescanning.'
    }
  },
  {
    id: 'card-3',
    number: '#015',
    title: '3Sum',
    pattern: 'Two Pointers',
    patternId: 'two-pointers',
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    difficulty: 'Medium',
    dueStatus: 'Due Today',
    lastHistory: 'Last: Code Viewed',
    sm2Interval: '1 day',
    sm2Ef: '2.1',
    hints: [
      'Sort the input array first to enable two-pointer convergence and simplified duplicate checking.',
      'Fix the first element nums[i] with a loop, then solve Two Sum on the remaining subarray using left & right pointers.',
      'Skip duplicate values for both nums[i] and candidate pairs to ensure all returned triplets are unique.'
    ],
    codeSolution: {
      language: 'Python 3',
      code: `def threeSum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l + 1]: l += 1
                while l < r and nums[r] == nums[r - 1]: r -= 1
                l += 1; r -= 1
    return res`,
      explanation: 'O(n²) time complexity using array sorting combined with two-pointer scan.'
    }
  }
];

export const App: React.FC = () => {
  const [cards, setCards] = useState<ProblemCardData[]>(INITIAL_CARDS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter cards based on active filter
  const filteredCards = cards.filter((card) => {
    if (activeFilter === 'all') return true;
    return card.patternId === activeFilter;
  });

  // Ensure active index stays within range
  useEffect(() => {
    if (activeCardIndex >= filteredCards.length) {
      setActiveCardIndex(Math.max(0, filteredCards.length - 1));
    }
  }, [activeFilter, filteredCards.length, activeCardIndex]);

  // Keyboard navigation shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toLowerCase();

      if (key === 'j' || key === 'arrowdown') {
        e.preventDefault();
        setActiveCardIndex((prev) => Math.min(prev + 1, filteredCards.length - 1));
      } else if (key === 'k' || key === 'arrowup') {
        e.preventDefault();
        setActiveCardIndex((prev) => Math.max(prev - 1, 0));
      } else if (key === '1') {
        const currentCard = filteredCards[activeCardIndex];
        if (currentCard) {
          showToast(`Card ${currentCard.number} marked as Solved Without Help! SM-2 interval updated.`);
        }
      } else if (key === '2') {
        const currentCard = filteredCards[activeCardIndex];
        if (currentCard) {
          showToast(`Viewing Hints for ${currentCard.number}: ${currentCard.title}`);
        }
      } else if (key === '3') {
        const currentCard = filteredCards[activeCardIndex];
        if (currentCard) {
          showToast(`Viewing Code Breakdown for ${currentCard.number}: ${currentCard.title}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCardIndex, filteredCards]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSolveCard = (cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === cardId
          ? { ...c, lastHistory: 'Last: Solved Without Help', sm2Interval: '7 days', sm2Ef: '2.6' }
          : c
      )
    );
    const card = cards.find((c) => c.id === cardId);
    showToast(`SM-2 Interval Updated: ${card?.title || 'Card'} rescheduled for +7 days.`);
  };

  return (
    <div className="min-h-screen bg-[#211832] text-white flex flex-col justify-between font-sans selection:bg-[#F25912] selection:text-white">
      {/* Top Navbar */}
      <Navbar onSyncComplete={() => showToast('LeetCode submissions synchronized successfully!')} />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex-1 flex flex-col">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 right-8 z-50 bg-[#412B6B] border border-[#F25912] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-[#F25912]"></span>
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Hero Telemetry */}
        <HeroTelemetry />

        {/* Pattern Filter Pills */}
        <PatternFilter
          activeFilter={activeFilter}
          onFilterChange={(filterId) => setActiveFilter(filterId)}
        />

        {/* Stacked Problem Cards */}
        {filteredCards.length > 0 ? (
          <div className="space-y-4 mb-8">
            {filteredCards.map((card, index) => (
              <ProblemCard
                key={card.id}
                card={card}
                isActiveCard={index === activeCardIndex}
                onSelectCard={() => setActiveCardIndex(index)}
                onSolveCard={handleSolveCard}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#2C1F45] border border-[#5C3E94] rounded-lg p-12 text-center text-[#B4A7D6] space-y-3 mb-8">
            <p className="font-semibold text-lg text-white">No cards matching filter</p>
            <p className="text-xs">
              All cards in this pattern category are up to date! Select &quot;All&quot; to view active items.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="px-4 py-1.5 bg-[#F25912] text-white text-xs rounded-md font-medium hover:bg-[#F25912]/90"
            >
              Reset Filter
            </button>
          </div>
        )}
      </main>

      {/* Bottom Status & Keycap Bar */}
      <StatusBar />
    </div>
  );
};
