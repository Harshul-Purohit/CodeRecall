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
    lastHistory: 'Last: Needed Hints',
    lastAttemptType: 'needed_hints',
    sm2Interval: '3 days',
    sm2Ef: '2.5',
    hints: [
      {
        step: 1,
        category: 'Pattern Hook',
        title: 'Complement Lookups with Hash Map',
        content: 'Instead of spending O(N²) running nested loops to test every pair (nums[i] + nums[j] == target), trade O(N) space for O(1) time lookups by hashing previously visited elements.'
      },
      {
        step: 2,
        category: 'Invariant State',
        title: 'Single-Pass Map Invariant',
        content: 'During iteration at index i, compute complement = target - nums[i]. Check if complement exists in seen map. If found, return [seen[complement], i]. Otherwise, record seen[nums[i]] = i.'
      },
      {
        step: 3,
        category: 'Edge Case Warning',
        title: 'Same Element Reuse Guard',
        content: 'Ensure you check for the complement in the hash map BEFORE inserting nums[i]. Inserting first could mistakenly pair an element with itself when target == 2 * nums[i].'
      }
    ],
    codeSolution: {
      language: 'Python 3',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      dryRun: {
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]'
      },
      codeLines: [
        'def twoSum(nums: list[int], target: int) -> list[int]:',
        '    seen = {}',
        '    for i, num in enumerate(nums):',
        '        complement = target - num',
        '        if complement in seen:',
        '            return [seen[complement], i]',
        '        seen[num] = i',
        '    return []'
      ],
      lineAnnotations: [
        {
          line: 2,
          title: 'Hash State Initialization',
          explanation: 'Creates an empty dictionary to store {num: index} mapping for past array elements.',
          type: 'init'
        },
        {
          line: 4,
          title: 'Target Delta Calculation',
          explanation: 'Computes exact complement value required to reach the target sum with current num.',
          type: 'state'
        },
        {
          line: 5,
          title: 'O(1) Map Presence Check',
          explanation: 'Checks whether required complement was previously stored in the hash map.',
          type: 'condition'
        },
        {
          line: 6,
          title: 'Return Matching Indices',
          explanation: 'Returns pair indices [seen[complement], i] upon finding matching complement.',
          type: 'return'
        }
      ],
      explanation: 'Optimal single-pass hash map algorithm operating in linear O(N) time complexity.'
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
    lastAttemptType: 'solved_without_help',
    sm2Interval: '7 days',
    sm2Ef: '2.6',
    hints: [
      {
        step: 1,
        category: 'Pattern Hook',
        title: 'Dynamic Sliding Window Range',
        content: 'Use two pointers [left, right] defining a contiguous window of unique characters over string s. Expand right pointer each step to incorporate new incoming characters.'
      },
      {
        step: 2,
        category: 'Invariant State',
        title: 'Last-Seen Character Pointer Jump',
        content: 'Store character last-seen index in a map. When encountering duplicate char at index right, update left = max(left, char_map[char] + 1) to prune invalid prefixes instantly.'
      },
      {
        step: 3,
        category: 'Edge Case Warning',
        title: 'Stale Map Index Guard',
        content: 'Take max(left, char_map[char] + 1) when jumping left pointer! If char_map[char] is smaller than current left, taking char_map[char] directly would regress the left pointer backwards.'
      }
    ],
    codeSolution: {
      language: 'Python 3',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(min(N, M))',
      dryRun: {
        input: 's = "abcabcbb"',
        expectedOutput: '3 (substring "abc")'
      },
      codeLines: [
        'def lengthOfLongestSubstring(s: str) -> int:',
        '    char_map = {}',
        '    left = max_len = 0',
        '    for right, char in enumerate(s):',
        '        if char in char_map and char_map[char] >= left:',
        '            left = char_map[char] + 1',
        '        char_map[char] = right',
        '        max_len = max(max_len, right - left + 1)',
        '    return max_len'
      ],
      lineAnnotations: [
        {
          line: 3,
          title: 'Pointer & Window Trackers',
          explanation: 'Initializes window left boundary and max_len variable to track longest unique substring seen so far.',
          type: 'init'
        },
        {
          line: 5,
          title: 'Duplicate Window Contraction',
          explanation: 'If incoming character exists within current window [left, right], advance left boundary past previous instance.',
          type: 'condition'
        },
        {
          line: 8,
          title: 'Max Window Length Update',
          explanation: 'Recalculates max_len at each step using current window span (right - left + 1).',
          type: 'state'
        },
        {
          line: 9,
          title: 'Return Max Substring Length',
          explanation: 'Returns optimal integer length of longest non-repeating substring.',
          type: 'return'
        }
      ],
      explanation: 'Optimal sliding window algorithm with dynamic index jump avoiding rescan of characters.'
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
    lastAttemptType: 'code_viewed',
    sm2Interval: '1 day',
    sm2Ef: '2.1',
    hints: [
      {
        step: 1,
        category: 'Pattern Hook',
        title: 'Sort + Two Pointer Convergence',
        content: 'Sort array nums first. Fixing the first element nums[i] transforms the problem into a 2Sum-in-sorted-array subproblem using left and right converging pointers.'
      },
      {
        step: 2,
        category: 'Invariant State',
        title: 'Sum Evaluation & Pointer Shift',
        content: 'Calculate current sum s = nums[i] + nums[left] + nums[right]. If s < 0, increment left. If s > 0, decrement right. If s == 0, record triplet and advance both pointers.'
      },
      {
        step: 3,
        category: 'Edge Case Warning',
        title: 'Duplicate Triplet Skipping',
        content: 'To prevent duplicate triplets in result: (1) Skip nums[i] if nums[i] == nums[i-1]. (2) After finding a match, advance left & right while adjacent values are identical.'
      }
    ],
    codeSolution: {
      language: 'Python 3',
      timeComplexity: 'O(N²)',
      spaceComplexity: 'O(1) auxiliary',
      dryRun: {
        input: 'nums = [-1, 0, 1, 2, -1, -4]',
        expectedOutput: '[[-1, -1, 2], [-1, 0, 1]]'
      },
      codeLines: [
        'def threeSum(nums: list[int]) -> list[list[int]]:',
        '    nums.sort()',
        '    res = []',
        '    for i in range(len(nums) - 2):',
        '        if i > 0 and nums[i] == nums[i - 1]: continue',
        '        l, r = i + 1, len(nums) - 1',
        '        while l < r:',
        '            s = nums[i] + nums[l] + nums[r]',
        '            if s < 0: l += 1',
        '            elif s > 0: r -= 1',
        '            else:',
        '                res.append([nums[i], nums[l], nums[r]])',
        '                while l < r and nums[l] == nums[l + 1]: l += 1',
        '                while l < r and nums[r] == nums[r - 1]: r -= 1',
        '                l += 1; r -= 1',
        '    return res'
      ],
      lineAnnotations: [
        {
          line: 2,
          title: 'In-Place Array Sorting',
          explanation: 'Sorts array in O(N log N) time to enable monotonic directional pointer convergence.',
          type: 'init'
        },
        {
          line: 5,
          title: 'Primary Duplicate Skip',
          explanation: 'Skips fix element nums[i] if identical to previous element nums[i-1] to eliminate duplicate triplets.',
          type: 'condition'
        },
        {
          line: 8,
          title: 'Triplet Sum Evaluation',
          explanation: 'Evaluates 3-element sum s against zero to decide whether to increment left or decrement right.',
          type: 'state'
        },
        {
          line: 12,
          title: 'Record & Skip Duplicate Candidates',
          explanation: 'Appends valid triplet and skips duplicate values for both left and right pointers.',
          type: 'return'
        }
      ],
      explanation: 'Two-pointer technique after array sorting achieving O(N²) time complexity.'
    }
  },
  {
    id: 'card-4',
    number: '#206',
    title: 'Reverse Linked List',
    pattern: 'Two Pointers',
    patternId: 'two-pointers',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    difficulty: 'Easy',
    dueStatus: 'Due Today',
    lastHistory: 'Last: Solved Without Help',
    lastAttemptType: 'solved_without_help',
    sm2Interval: '6 days',
    sm2Ef: '2.5',
    hints: [
      {
        step: 1,
        category: 'Pattern Hook',
        title: 'Iterative Pointer Reversal',
        content: 'Use two main pointers (prev = None, curr = head). At each step, preserve next node reference before redirecting curr.next back to prev.'
      },
      {
        step: 2,
        category: 'Invariant State',
        title: 'Three-Step Pointer Shift',
        content: 'Inside loop while curr: (1) nxt = curr.next (2) curr.next = prev (3) prev = curr, curr = nxt.'
      },
      {
        step: 3,
        category: 'Edge Case Warning',
        title: 'Empty & Single Node Return',
        content: 'Ensure algorithm handles head == None or single node without null pointer exceptions. When curr reaches None, prev becomes the new head.'
      }
    ],
    codeSolution: {
      language: 'Python 3',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      dryRun: {
        input: 'head = [1, 2, 3, 4, 5]',
        expectedOutput: '[5, 4, 3, 2, 1]'
      },
      codeLines: [
        'def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:',
        '    prev = None',
        '    curr = head',
        '    while curr:',
        '        nxt = curr.next',
        '        curr.next = prev',
        '        prev = curr',
        '        curr = nxt',
        '    return prev'
      ],
      lineAnnotations: [
        {
          line: 2,
          title: 'Initialize Prev Pointer',
          explanation: 'Sets prev to None, which will become the tail node.next of reversed list.',
          type: 'init'
        },
        {
          line: 5,
          title: 'Preserve Forward Connection',
          explanation: 'Saves curr.next to nxt temporary reference before overwriting pointer link.',
          type: 'state'
        },
        {
          line: 6,
          title: 'Pointer Direction Reversal',
          explanation: 'Redirects curr.next backward to point to prev node.',
          type: 'state'
        },
        {
          line: 9,
          title: 'Return New Head Node',
          explanation: 'Returns prev as new head of fully reversed linked list.',
          type: 'return'
        }
      ],
      explanation: 'In-place linked list pointer reversal in O(N) time and O(1) space complexity.'
    }
  }
];

export const App: React.FC = () => {
  const [cards, setCards] = useState<ProblemCardData[]>(INITIAL_CARDS);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timestamp trigger passed down to active card for keyboard shortcuts
  const [keyboardTrigger, setKeyboardTrigger] = useState<{
    key: '1' | '2' | '3';
    timestamp: number;
  } | null>(null);

  // Filter cards based on active pattern filter
  const filteredCards = cards.filter((card) => {
    if (activeFilter === 'all') return true;
    return card.patternId === activeFilter;
  });

  // Keep active index inside bounds when filter changes
  useEffect(() => {
    if (activeCardIndex >= filteredCards.length) {
      setActiveCardIndex(Math.max(0, filteredCards.length - 1));
    }
  }, [activeFilter, filteredCards.length, activeCardIndex]);

  // Global keyboard shortcuts (1, 2, 3, J, K, ArrowUp, ArrowDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut inputs if user is typing in an input element
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const key = e.key.toLowerCase();

      if (key === 'j' || key === 'arrowdown') {
        e.preventDefault();
        setActiveCardIndex((prev) => Math.min(prev + 1, filteredCards.length - 1));
      } else if (key === 'k' || key === 'arrowup') {
        e.preventDefault();
        setActiveCardIndex((prev) => Math.max(prev - 1, 0));
      } else if (key === '1') {
        e.preventDefault();
        setKeyboardTrigger({ key: '1', timestamp: Date.now() });
      } else if (key === '2') {
        e.preventDefault();
        setKeyboardTrigger({ key: '2', timestamp: Date.now() });
      } else if (key === '3') {
        e.preventDefault();
        setKeyboardTrigger({ key: '3', timestamp: Date.now() });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCardIndex, filteredCards]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Handler: Solved Without Help
  const handleSolveWithoutHelp = (cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((c) => {
        if (c.id === cardId) {
          // Double SM-2 interval or extend
          const currentDays = parseInt(c.sm2Interval) || 3;
          const newDays = Math.min(30, currentDays * 2);
          const newEf = (parseFloat(c.sm2Ef) + 0.1).toFixed(1);

          return {
            ...c,
            lastHistory: 'Last: Solved Without Help',
            lastAttemptType: 'solved_without_help',
            sm2Interval: `${newDays} days`,
            sm2Ef: newEf
          };
        }
        return c;
      })
    );

    const card = cards.find((c) => c.id === cardId);
    showToast(`✓ Marked ${card?.number || 'Card'} as Solved Without Help! Next review rescheduled.`);
  };

  // Handler: Needed Hints
  const handleNeedHints = (cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            lastHistory: 'Last: Needed Hints',
            lastAttemptType: 'needed_hints',
            sm2Interval: '3 days'
          };
        }
        return c;
      })
    );

    const card = cards.find((c) => c.id === cardId);
    showToast(`💡 Opened Hints Drawer for ${card?.number || 'Card'}. Attempt status set to Needed Hints.`);
  };

  // Handler: View Solution & Breakdown
  const handleViewSolution = (cardId: string) => {
    setCards((prevCards) =>
      prevCards.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            lastHistory: 'Last: Code Viewed',
            lastAttemptType: 'code_viewed',
            sm2Interval: '1 day'
          };
        }
        return c;
      })
    );

    const card = cards.find((c) => c.id === cardId);
    showToast(`</> Solution Breakdown opened for ${card?.number || 'Card'}. Attempt status set to Code Viewed.`);
  };

  return (
    <div className="min-h-screen bg-[#211832] text-white flex flex-col justify-between font-sans selection:bg-[#F25912] selection:text-white">
      {/* Top Navbar */}
      <Navbar onSyncComplete={() => showToast('LeetCode submissions synchronized successfully!')} />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex-1 flex flex-col">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 right-8 z-50 bg-[#412B6B] border border-[#F25912] text-white px-4 py-2.5 rounded-lg shadow-2xl text-xs flex items-center gap-2.5 animate-bounce font-mono">
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

        {/* Stacked Problem Cards with 3-Column Active Recall Drawer */}
        {filteredCards.length > 0 ? (
          <div className="space-y-4 mb-8">
            {filteredCards.map((card, index) => (
              <ProblemCard
                key={card.id}
                card={card}
                isActiveCard={index === activeCardIndex}
                onSelectCard={() => setActiveCardIndex(index)}
                onSolveWithoutHelp={handleSolveWithoutHelp}
                onNeedHints={handleNeedHints}
                onViewSolution={handleViewSolution}
                keyboardTrigger={index === activeCardIndex ? keyboardTrigger : null}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#2C1F45] border border-[#5C3E94] rounded-lg p-12 text-center text-[#B4A7D6] space-y-3 mb-8">
            <p className="font-semibold text-lg text-white">No cards matching pattern filter</p>
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
