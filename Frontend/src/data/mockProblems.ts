import { ProblemCardData } from '../types/problem';

export const INITIAL_CARDS: ProblemCardData[] = [
  {
    id: 'card-1',
    problemNumber: '#001',
    number: '#001',
    title: 'Two Sum',
    patterns: ['Hashing', 'Two Pointers'],
    pattern: 'Hashing',
    patternId: 'hashing',
    leetcodeUrl: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    sm2: {
      intervalDays: 3,
      easinessFactor: 2.5,
      nextReviewDate: '2026-10-06',
      repetitionCount: 2,
      lastAttemptResult: 'NEEDED_HINTS'
    },
    isDueToday: true,
    isOverdue: false,
    isMastered: true,
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
      language: 'Python',
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
      explanation: 'Optimal single-pass hash map algorithm operating in linear O(N) time complexity.',
      languages: {
        Python: {
          language: 'Python',
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
              explanation: 'Creates an empty dict for {num: index} lookups.',
              type: 'init'
            },
            {
              line: 4,
              title: 'Target Delta Calculation',
              explanation: 'Computes target - num complement.',
              type: 'state'
            },
            {
              line: 5,
              title: 'O(1) Map Lookup',
              explanation: 'Checks if complement exists in seen map.',
              type: 'condition'
            },
            {
              line: 6,
              title: 'Return Pair Indices',
              explanation: 'Returns [seen[complement], i] on match.',
              type: 'return'
            }
          ]
        },
        JavaScript: {
          language: 'JavaScript',
          codeLines: [
            'function twoSum(nums, target) {',
            '  const seen = new Map();',
            '  for (let i = 0; i < nums.length; i++) {',
            '    const complement = target - nums[i];',
            '    if (seen.has(complement)) {',
            '      return [seen.get(complement), i];',
            '    }',
            '    seen.set(nums[i], i);',
            '  }',
            '  return [];',
            '}'
          ],
          lineAnnotations: [
            {
              line: 2,
              title: 'JS Map Initialization',
              explanation: 'Instantiates ES6 Map object for O(1) key-value hash lookups.',
              type: 'init'
            },
            {
              line: 4,
              title: 'Complement Calculation',
              explanation: 'Calculates target - nums[i] for current iteration.',
              type: 'state'
            },
            {
              line: 5,
              title: 'Map.has Check',
              explanation: 'Uses seen.has(complement) for fast O(1) key lookup.',
              type: 'condition'
            },
            {
              line: 6,
              title: 'Return Result Array',
              explanation: 'Returns pair indices array [seen.get(complement), i].',
              type: 'return'
            }
          ]
        },
        'C++': {
          language: 'C++',
          codeLines: [
            'vector<int> twoSum(vector<int>& nums, int target) {',
            '    unordered_map<int, int> seen;',
            '    for (int i = 0; i < nums.size(); ++i) {',
            '        int complement = target - nums[i];',
            '        if (seen.count(complement)) {',
            '            return {seen[complement], i};',
            '        }',
            '        seen[nums[i]] = i;',
            '    }',
            '    return {};',
            '}'
          ],
          lineAnnotations: [
            {
              line: 2,
              title: 'STL Unordered Map Init',
              explanation: 'Initializes std::unordered_map for O(1) average hash table operations.',
              type: 'init'
            },
            {
              line: 4,
              title: 'Complement Delta',
              explanation: 'Calculates integer complement = target - nums[i].',
              type: 'state'
            },
            {
              line: 5,
              title: 'seen.count() Check',
              explanation: 'Uses seen.count(complement) to check hash key existence.',
              type: 'condition'
            },
            {
              line: 6,
              title: 'Return Vector Pair',
              explanation: 'Returns inline vector initializer list {seen[complement], i}.',
              type: 'return'
            }
          ]
        },
        Java: {
          language: 'Java',
          codeLines: [
            'public int[] twoSum(int[] nums, int target) {',
            '    Map<Integer, Integer> seen = new HashMap<>();',
            '    for (int i = 0; i < nums.length; i++) {',
            '        int complement = target - nums[i];',
            '        if (seen.containsKey(complement)) {',
            '            return new int[] { seen.get(complement), i };',
            '        }',
            '        seen.put(nums[i], i);',
            '    }',
            '    return new int[] {};',
            '}'
          ],
          lineAnnotations: [
            {
              line: 2,
              title: 'Java HashMap Init',
              explanation: 'Instantiates HashMap<Integer, Integer> for integer pair lookup.',
              type: 'init'
            },
            {
              line: 4,
              title: 'Complement Calculation',
              explanation: 'Computes target - nums[i].',
              type: 'state'
            },
            {
              line: 5,
              title: 'containsKey Check',
              explanation: 'Invokes containsKey(complement) for O(1) presence verification.',
              type: 'condition'
            },
            {
              line: 6,
              title: 'Return Primitive Array',
              explanation: 'Returns new int[] { seen.get(complement), i }.',
              type: 'return'
            }
          ]
        }
      }
    }
  },
  {
    id: 'card-2',
    problemNumber: '#003',
    number: '#003',
    title: 'Longest Substring Without Repeating Characters',
    patterns: ['Sliding Window', 'Hashing'],
    pattern: 'Sliding Window',
    patternId: 'sliding-window',
    leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    difficulty: 'Medium',
    sm2: {
      intervalDays: 7,
      easinessFactor: 2.6,
      nextReviewDate: '2026-10-10',
      repetitionCount: 3,
      lastAttemptResult: 'SOLVED_WITHOUT_HELP'
    },
    isDueToday: false,
    isOverdue: false,
    isMastered: true,
    dueStatus: 'Future Review',
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
      language: 'Python',
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
          explanation: 'Initializes window left boundary and max_len variable.',
          type: 'init'
        },
        {
          line: 5,
          title: 'Duplicate Window Contraction',
          explanation: 'If incoming character exists in current window, advance left boundary.',
          type: 'condition'
        },
        {
          line: 8,
          title: 'Max Window Length Update',
          explanation: 'Recalculates max_len using current window span (right - left + 1).',
          type: 'state'
        },
        {
          line: 9,
          title: 'Return Max Substring Length',
          explanation: 'Returns optimal integer length of longest non-repeating substring.',
          type: 'return'
        }
      ],
      explanation: 'Optimal sliding window algorithm with dynamic index jump.',
      languages: {
        Python: {
          language: 'Python',
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
              title: 'Pointer Trackers',
              explanation: 'Initializes left and max_len pointers to 0.',
              type: 'init'
            },
            {
              line: 5,
              title: 'Left Jump Condition',
              explanation: 'Checks if duplicate char occurs within current window [left, right].',
              type: 'condition'
            },
            {
              line: 6,
              title: 'Left Pointer Advance',
              explanation: 'Jumps left pointer past previous occurrence of duplicate character.',
              type: 'state'
            },
            {
              line: 9,
              title: 'Return Max Length',
              explanation: 'Returns integer max_len of longest unique substring.',
              type: 'return'
            }
          ]
        }
      }
    }
  },
  {
    id: 'card-3',
    problemNumber: '#015',
    number: '#015',
    title: '3Sum',
    patterns: ['Two Pointers', 'Sorting'],
    pattern: 'Two Pointers',
    patternId: 'two-pointers',
    leetcodeUrl: 'https://leetcode.com/problems/3sum/',
    difficulty: 'Medium',
    sm2: {
      intervalDays: 1,
      easinessFactor: 2.1,
      nextReviewDate: '2026-10-06',
      repetitionCount: 1,
      lastAttemptResult: 'CODE_VIEWED'
    },
    isDueToday: true,
    isOverdue: false,
    isMastered: false,
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
      language: 'Python',
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
          explanation: 'Sorts array in O(N log N) time to enable monotonic pointer convergence.',
          type: 'init'
        },
        {
          line: 5,
          title: 'Primary Duplicate Skip',
          explanation: 'Skips fix element nums[i] if identical to previous element nums[i-1].',
          type: 'condition'
        },
        {
          line: 8,
          title: 'Triplet Sum Evaluation',
          explanation: 'Evaluates 3-element sum s against zero.',
          type: 'state'
        },
        {
          line: 12,
          title: 'Record & Skip Duplicate Candidates',
          explanation: 'Appends valid triplet and skips duplicate values for both pointers.',
          type: 'return'
        }
      ],
      explanation: 'Two-pointer technique after array sorting achieving O(N²) time complexity.'
    }
  },
  {
    id: 'card-4',
    problemNumber: '#206',
    number: '#206',
    title: 'Reverse Linked List',
    patterns: ['Two Pointers', 'Linked List'],
    pattern: 'Two Pointers',
    patternId: 'two-pointers',
    leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/',
    difficulty: 'Easy',
    sm2: {
      intervalDays: 6,
      easinessFactor: 2.5,
      nextReviewDate: '2026-10-06',
      repetitionCount: 3,
      lastAttemptResult: 'SOLVED_WITHOUT_HELP'
    },
    isDueToday: true,
    isOverdue: false,
    isMastered: true,
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
      language: 'Python',
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
          explanation: 'Sets prev to None, which will become tail node.next.',
          type: 'init'
        },
        {
          line: 5,
          title: 'Preserve Forward Connection',
          explanation: 'Saves curr.next to nxt temporary reference.',
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
          explanation: 'Returns prev as new head of fully reversed list.',
          type: 'return'
        }
      ],
      explanation: 'In-place linked list pointer reversal in O(N) time and O(1) space complexity.'
    }
  },
  {
    id: 'card-5',
    problemNumber: '#076',
    number: '#076',
    title: 'Minimum Window Substring',
    patterns: ['Sliding Window', 'Hashing', 'Two Pointers'],
    pattern: 'Sliding Window',
    patternId: 'sliding-window',
    leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/',
    difficulty: 'Hard',
    sm2: {
      intervalDays: 1,
      easinessFactor: 1.9,
      nextReviewDate: '2026-10-04', // Overdue
      repetitionCount: 1,
      lastAttemptResult: 'CODE_VIEWED'
    },
    isDueToday: true,
    isOverdue: true,
    isMastered: false,
    dueStatus: 'Overdue (2d ago)',
    lastHistory: 'Last: Code Viewed',
    lastAttemptType: 'code_viewed',
    sm2Interval: '1 day',
    sm2Ef: '1.9',
    hints: [
      {
        step: 1,
        category: 'Pattern Hook',
        title: 'Two Frequency Maps & Formed Match Counter',
        content: 'Maintain a frequency map of target string t and a sliding window frequency map for s. Track `have` vs `need` character count condition matches.'
      },
      {
        step: 2,
        category: 'Invariant State',
        title: 'Window Contraction Condition',
        content: 'Expand right pointer until all required characters are satisfied (`have == need`). Then shrink left pointer to find the minimum valid window size.'
      },
      {
        step: 3,
        category: 'Edge Case Warning',
        title: 'Minimum Length Window Boundary Track',
        content: 'Update optimal substring indices `[res_left, res_right]` whenever `have == need` and current window length `(right - left + 1)` is smaller than previous minimum.'
      }
    ],
    codeSolution: {
      language: 'Python',
      timeComplexity: 'O(N + M)',
      spaceComplexity: 'O(N + M)',
      dryRun: {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        expectedOutput: '"BANC"'
      },
      codeLines: [
        'def minWindow(s: str, t: str) -> str:',
        '    if not t or not s: return ""',
        '    countT, window = {}, {}',
        '    for c in t: countT[c] = countT.get(c, 0) + 1',
        '    have, need = 0, len(countT)',
        '    res, resLen = [-1, -1], float("inf")',
        '    l = 0',
        '    for r, c in enumerate(s):',
        '        window[c] = window.get(c, 0) + 1',
        '        if c in countT and window[c] == countT[c]: have += 1',
        '        while have == need:',
        '            if (r - l + 1) < resLen:',
        '                resLen = r - l + 1',
        '                res = [l, r]',
        '            window[s[l]] -= 1',
        '            if s[l] in countT and window[s[l]] < countT[s[l]]: have -= 1',
        '            l += 1',
        '    return s[res[0]:res[1]+1] if resLen != float("inf") else ""'
      ],
      lineAnnotations: [
        {
          line: 4,
          title: 'Target Map Initialization',
          explanation: 'Builds frequency map of required characters from string t.',
          type: 'init'
        },
        {
          line: 11,
          title: 'Contract Window When Valid',
          explanation: 'While window satisfies all required characters, shrink left boundary.',
          type: 'condition'
        },
        {
          line: 13,
          title: 'Update Minimum Result',
          explanation: 'Records smallest valid window slice range found so far.',
          type: 'state'
        },
        {
          line: 18,
          title: 'Return Substring Slice',
          explanation: 'Returns sliced string using minimum length left/right indices.',
          type: 'return'
        }
      ],
      explanation: 'Hard sliding window problem solved in linear time with dynamic left pointer contraction.'
    }
  },
  {
    id: 'card-6',
    problemNumber: '#053',
    number: '#053',
    title: 'Maximum Subarray',
    patterns: ['Dynamic Programming', 'Divide and Conquer'],
    pattern: 'Dynamic Programming',
    patternId: 'dp',
    leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/',
    difficulty: 'Medium',
    sm2: {
      intervalDays: 28,
      easinessFactor: 2.7,
      nextReviewDate: '2026-10-25',
      repetitionCount: 6,
      lastAttemptResult: 'SOLVED_WITHOUT_HELP'
    },
    isDueToday: false,
    isOverdue: false,
    isMastered: true,
    dueStatus: 'Mastered (28d)',
    lastHistory: 'Last: Solved Without Help',
    lastAttemptType: 'solved_without_help',
    sm2Interval: '28 days',
    sm2Ef: '2.7',
    hints: [
      {
        step: 1,
        category: 'Pattern Hook',
        title: 'Kadane\'s Algorithm Invariant',
        content: 'At each index i, decide whether to append nums[i] to the existing running subarray sum or start a fresh subarray at nums[i].'
      },
      {
        step: 2,
        category: 'Invariant State',
        title: 'Local vs Global Max Recurrence',
        content: '`current_max = max(nums[i], current_max + nums[i])`. Track `global_max = max(global_max, current_max)`.'
      },
      {
        step: 3,
        category: 'Edge Case Warning',
        title: 'All-Negative Elements Array',
        content: 'Initialize `global_max` to `nums[0]` (or -inf) rather than 0. If all elements are negative, picking the single largest negative number is mandatory.'
      }
    ],
    codeSolution: {
      language: 'Python',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      dryRun: {
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        expectedOutput: '6 (subarray [4, -1, 2, 1])'
      },
      codeLines: [
        'def maxSubArray(nums: list[int]) -> int:',
        '    max_sum = cur_sum = nums[0]',
        '    for num in nums[1:]:',
        '        cur_sum = max(num, cur_sum + num)',
        '        max_sum = max(max_sum, cur_sum)',
        '    return max_sum'
      ],
      lineAnnotations: [
        {
          line: 2,
          title: 'Initial State Assignment',
          explanation: 'Initializes max_sum and cur_sum with first element to handle negative numbers.',
          type: 'init'
        },
        {
          line: 4,
          title: 'Kadane Choice Transition',
          explanation: 'Decides to start a new subarray if cur_sum becomes negative.',
          type: 'state'
        },
        {
          line: 6,
          title: 'Return Global Max Sum',
          explanation: 'Returns maximum contiguous subarray sum found.',
          type: 'return'
        }
      ],
      explanation: 'Kadane\'s linear DP algorithm with O(1) extra space.'
    }
  },
  {
    id: 'card-7',
    problemNumber: '#033',
    number: '#033',
    title: 'Search in Rotated Sorted Array',
    patterns: ['Binary Search'],
    pattern: 'Binary Search',
    patternId: 'binary-search',
    leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    difficulty: 'Medium',
    sm2: {
      intervalDays: 2,
      easinessFactor: 2.2,
      nextReviewDate: '2026-10-05', // Overdue by 1 day
      repetitionCount: 2,
      lastAttemptResult: 'NEEDED_HINTS'
    },
    isDueToday: true,
    isOverdue: true,
    isMastered: false,
    dueStatus: 'Overdue (1d ago)',
    lastHistory: 'Last: Needed Hints',
    lastAttemptType: 'needed_hints',
    sm2Interval: '2 days',
    sm2Ef: '2.2',
    hints: [
      {
        step: 1,
        category: 'Pattern Hook',
        title: 'One-Half Monotonicity Guarantee',
        content: 'Even after array rotation, at least one half [left...mid] or [mid...right] is strictly sorted ascending.'
      },
      {
        step: 2,
        category: 'Invariant State',
        title: 'Sorted Range Inclusion Check',
        content: 'Check if `nums[left] <= nums[mid]`. If so, left half is sorted. Check if target lies within `[nums[left], nums[mid]]` to decide search direction.'
      },
      {
        step: 3,
        category: 'Edge Case Warning',
        title: 'Inclusive Range Boundaries',
        content: 'Use `nums[left] <= target < nums[mid]` (with strictly `< nums[mid]` since `mid` was checked) to eliminate invalid bounds.'
      }
    ],
    codeSolution: {
      language: 'Python',
      timeComplexity: 'O(log N)',
      spaceComplexity: 'O(1)',
      dryRun: {
        input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0',
        expectedOutput: '4 (index of target 0)'
      },
      codeLines: [
        'def search(nums: list[int], target: int) -> int:',
        '    l, r = 0, len(nums) - 1',
        '    while l <= r:',
        '        mid = (l + r) // 2',
        '        if nums[mid] == target: return mid',
        '        if nums[l] <= nums[mid]:',
        '            if nums[l] <= target < nums[mid]: r = mid - 1',
        '            else: l = mid + 1',
        '        else:',
        '            if nums[mid] < target <= nums[r]: l = mid + 1',
        '            else: r = mid - 1',
        '    return -1'
      ],
      lineAnnotations: [
        {
          line: 2,
          title: 'Binary Search Pointers',
          explanation: 'Sets up left and right boundary indices for range halving.',
          type: 'init'
        },
        {
          line: 6,
          title: 'Left Half Monotonicity Check',
          explanation: 'Checks if left subarray [l...mid] is sorted monotonically.',
          type: 'condition'
        },
        {
          line: 12,
          title: 'Return Result Index',
          explanation: 'Returns index of target or -1 if target absent.',
          type: 'return'
        }
      ],
      explanation: 'Modified logarithmic binary search algorithm.'
    }
  },
  {
    id: 'card-8',
    problemNumber: '#121',
    number: '#121',
    title: 'Best Time to Buy and Sell Stock',
    patterns: ['Dynamic Programming', 'Two Pointers'],
    pattern: 'Dynamic Programming',
    patternId: 'dp',
    leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    difficulty: 'Easy',
    sm2: {
      intervalDays: 30,
      easinessFactor: 2.8,
      nextReviewDate: '2026-10-30',
      repetitionCount: 7,
      lastAttemptResult: 'SOLVED_WITHOUT_HELP'
    },
    isDueToday: false,
    isOverdue: false,
    isMastered: true,
    dueStatus: 'Mastered (30d)',
    lastHistory: 'Last: Solved Without Help',
    lastAttemptType: 'solved_without_help',
    sm2Interval: '30 days',
    sm2Ef: '2.8',
    hints: [
      {
        step: 1,
        category: 'Pattern Hook',
        title: 'Single Pass Minimum Tracking',
        content: 'Maintain the minimum buy price seen so far while iterating through future sell prices.'
      },
      {
        step: 2,
        category: 'Invariant State',
        title: 'Profit Delta Calculation',
        content: 'At price p: `min_price = min(min_price, p)` and `max_profit = max(max_profit, p - min_price)`.'
      },
      {
        step: 3,
        category: 'Edge Case Warning',
        title: 'Monotonically Decreasing Prices',
        content: 'If prices decrease continuously, max profit remains 0 as initialized.'
      }
    ],
    codeSolution: {
      language: 'Python',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      dryRun: {
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        expectedOutput: '5 (buy at 1, sell at 6)'
      },
      codeLines: [
        'def maxProfit(prices: list[int]) -> int:',
        '    min_price = float("inf")',
        '    max_profit = 0',
        '    for price in prices:',
        '        min_price = min(min_price, price)',
        '        max_profit = max(max_profit, price - min_price)',
        '    return max_profit'
      ],
      lineAnnotations: [
        {
          line: 2,
          title: 'Minimum Trackers Init',
          explanation: 'Initializes min_price to infinity and max_profit to zero.',
          type: 'init'
        },
        {
          line: 5,
          title: 'Minimum Price Update',
          explanation: 'Keeps track of lowest buy point encountered so far.',
          type: 'state'
        },
        {
          line: 7,
          title: 'Return Max Profit',
          explanation: 'Returns maximum non-negative profit attainable.',
          type: 'return'
        }
      ],
      explanation: 'Optimal linear single-pass algorithm.'
    }
  }
];
