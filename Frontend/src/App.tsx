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
        },
        JavaScript: {
          language: 'JavaScript',
          codeLines: [
            'function lengthOfLongestSubstring(s) {',
            '  const charMap = new Map();',
            '  let left = 0, maxLen = 0;',
            '  for (let right = 0; right < s.length; right++) {',
            '    const char = s[right];',
            '    if (charMap.has(char) && charMap.get(char) >= left) {',
            '      left = charMap.get(char) + 1;',
            '    }',
            '    charMap.set(char, right);',
            '    maxLen = Math.max(maxLen, right - left + 1);',
            '  }',
            '  return maxLen;',
            '}'
          ],
          lineAnnotations: [
            {
              line: 3,
              title: 'Window Variables Init',
              explanation: 'Initializes left boundary and maxLen accumulator.',
              type: 'init'
            },
            {
              line: 6,
              title: 'Map Index Range Check',
              explanation: 'Checks if duplicate character index is >= left to prevent regressing.',
              type: 'condition'
            },
            {
              line: 10,
              title: 'Math.max Window Span',
              explanation: 'Updates maxLen using Math.max(maxLen, right - left + 1).',
              type: 'state'
            },
            {
              line: 12,
              title: 'Return Result',
              explanation: 'Returns maxLen integer value.',
              type: 'return'
            }
          ]
        },
        'C++': {
          language: 'C++',
          codeLines: [
            'int lengthOfLongestSubstring(string s) {',
            '    unordered_map<char, int> charMap;',
            '    int left = 0, maxLen = 0;',
            '    for (int right = 0; right < s.size(); ++right) {',
            '        if (charMap.count(s[right]) && charMap[s[right]] >= left) {',
            '            left = charMap[s[right]] + 1;',
            '        }',
            '        charMap[s[right]] = right;',
            '        maxLen = max(maxLen, right - left + 1);',
            '    }',
            '    return maxLen;',
            '}'
          ],
          lineAnnotations: [
            {
              line: 3,
              title: 'C++ Pointers Init',
              explanation: 'Initializes left and maxLen integers to zero.',
              type: 'init'
            },
            {
              line: 5,
              title: 'charMap.count Presence Check',
              explanation: 'Verifies character presence and index validity inside current window.',
              type: 'condition'
            },
            {
              line: 9,
              title: 'std::max Calculation',
              explanation: 'Updates maxLen via std::max(maxLen, right - left + 1).',
              type: 'state'
            },
            {
              line: 11,
              title: 'Return Substring Length',
              explanation: 'Returns integer maxLen.',
              type: 'return'
            }
          ]
        },
        Java: {
          language: 'Java',
          codeLines: [
            'public int lengthOfLongestSubstring(String s) {',
            '    Map<Character, Integer> charMap = new HashMap<>();',
            '    int left = 0, maxLen = 0;',
            '    for (int right = 0; right < s.length(); right++) {',
            '        char c = s.charAt(right);',
            '        if (charMap.containsKey(c) && charMap.get(c) >= left) {',
            '            left = charMap.get(c) + 1;',
            '        }',
            '        charMap.put(c, right);',
            '        maxLen = Math.max(maxLen, right - left + 1);',
            '    }',
            '    return maxLen;',
            '}'
          ],
          lineAnnotations: [
            {
              line: 3,
              title: 'Java Window Init',
              explanation: 'Creates HashMap<Character, Integer> for character index tracking.',
              type: 'init'
            },
            {
              line: 6,
              title: 'containsKey Check',
              explanation: 'Checks if character exists in map and has index >= left.',
              type: 'condition'
            },
            {
              line: 10,
              title: 'Math.max Window Recalculation',
              explanation: 'Updates maxLen using Math.max.',
              type: 'state'
            },
            {
              line: 12,
              title: 'Return Int Result',
              explanation: 'Returns maxLen integer.',
              type: 'return'
            }
          ]
        }
      }
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
      explanation: 'Two-pointer technique after array sorting achieving O(N²) time complexity.',
      languages: {
        Python: {
          language: 'Python',
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
              explanation: 'Sorts array to allow directional two-pointer scan.',
              type: 'init'
            },
            {
              line: 5,
              title: 'Duplicate Anchor Skip',
              explanation: 'Skips identical anchor elements to avoid duplicate triplets.',
              type: 'condition'
            },
            {
              line: 8,
              title: 'Sum Evaluation',
              explanation: 'Calculates 3-element sum.',
              type: 'state'
            },
            {
              line: 16,
              title: 'Return Triplet List',
              explanation: 'Returns list of unique triplets.',
              type: 'return'
            }
          ]
        },
        JavaScript: {
          language: 'JavaScript',
          codeLines: [
            'function threeSum(nums) {',
            '  nums.sort((a, b) => a - b);',
            '  const res = [];',
            '  for (let i = 0; i < nums.length - 2; i++) {',
            '    if (i > 0 && nums[i] === nums[i - 1]) continue;',
            '    let l = i + 1, r = nums.length - 1;',
            '    while (l < r) {',
            '      const sum = nums[i] + nums[l] + nums[r];',
            '      if (sum < 0) l++;',
            '      else if (sum > 0) r--;',
            '      else {',
            '        res.push([nums[i], nums[l], nums[r]]);',
            '        while (l < r && nums[l] === nums[l + 1]) l++;',
            '        while (l < r && nums[r] === nums[r - 1]) r--;',
            '        l++; r--;',
            '      }',
            '    }',
            '  }',
            '  return res;',
            '}'
          ],
          lineAnnotations: [
            {
              line: 2,
              title: 'JS Numerical Sort',
              explanation: 'Sorts nums in numerical ascending order using (a, b) => a - b.',
              type: 'init'
            },
            {
              line: 5,
              title: 'Skip Duplicate i',
              explanation: 'Skips duplicate values for outer loop index i.',
              type: 'condition'
            },
            {
              line: 8,
              title: 'Sum Comparison',
              explanation: 'Computes sum of nums[i] + nums[l] + nums[r].',
              type: 'state'
            },
            {
              line: 19,
              title: 'Return Triplet Array',
              explanation: 'Returns result array of unique triplets.',
              type: 'return'
            }
          ]
        },
        'C++': {
          language: 'C++',
          codeLines: [
            'vector<vector<int>> threeSum(vector<int>& nums) {',
            '    sort(nums.begin(), nums.end());',
            '    vector<vector<int>> res;',
            '    for (int i = 0; i < (int)nums.size() - 2; ++i) {',
            '        if (i > 0 && nums[i] == nums[i - 1]) continue;',
            '        int l = i + 1, r = nums.size() - 1;',
            '        while (l < r) {',
            '            int sum = nums[i] + nums[l] + nums[r];',
            '            if (sum < 0) l++;',
            '            else if (sum > 0) r--;',
            '            else {',
            '                res.push_back({nums[i], nums[l], nums[r]});',
            '                while (l < r && nums[l] == nums[l + 1]) l++;',
            '                while (l < r && nums[r] == nums[r - 1]) r--;',
            '                l++; r--;',
            '            }',
            '        }',
            '    }',
            '    return res;',
            '}'
          ],
          lineAnnotations: [
            {
              line: 2,
              title: 'std::sort Implementation',
              explanation: 'Uses C++ std::sort over nums vector.',
              type: 'init'
            },
            {
              line: 5,
              title: 'Duplicate Anchor Skip',
              explanation: 'Skips duplicate values for anchor pointer i.',
              type: 'condition'
            },
            {
              line: 12,
              title: 'Push Back Vector Triplet',
              explanation: 'Inserts triplet into 2D vector result.',
              type: 'state'
            },
            {
              line: 19,
              title: 'Return 2D Vector',
              explanation: 'Returns vector of vector triplets.',
              type: 'return'
            }
          ]
        },
        Java: {
          language: 'Java',
          codeLines: [
            'public List<List<Integer>> threeSum(int[] nums) {',
            '    Arrays.sort(nums);',
            '    List<List<Integer>> res = new ArrayList<>();',
            '    for (int i = 0; i < nums.length - 2; i++) {',
            '        if (i > 0 && nums[i] == nums[i - 1]) continue;',
            '        int l = i + 1, r = nums.length - 1;',
            '        while (l < r) {',
            '            int sum = nums[i] + nums[l] + nums[r];',
            '            if (sum < 0) l++;',
            '            else if (sum > 0) r--;',
            '            else {',
            '                res.add(Arrays.asList(nums[i], nums[l], nums[r]));',
            '                while (l < r && nums[l] == nums[l + 1]) l++;',
            '                while (l < r && nums[r] == nums[r - 1]) r--;',
            '                l++; r--;',
            '            }',
            '        }',
            '    }',
            '    return res;',
            '}'
          ],
          lineAnnotations: [
            {
              line: 2,
              title: 'Arrays.sort Utility',
              explanation: 'Sorts primitive int array using dual-pivot Quicksort.',
              type: 'init'
            },
            {
              line: 5,
              title: 'Duplicate i Check',
              explanation: 'Skips anchor iteration if nums[i] == nums[i-1].',
              type: 'condition'
            },
            {
              line: 12,
              title: 'Arrays.asList Builder',
              explanation: 'Constructs List<Integer> triplet and adds to res.',
              type: 'state'
            },
            {
              line: 19,
              title: 'Return Triplet List',
              explanation: 'Returns List<List<Integer>>.',
              type: 'return'
            }
          ]
        }
      }
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
      explanation: 'In-place linked list pointer reversal in O(N) time and O(1) space complexity.',
      languages: {
        Python: {
          language: 'Python',
          codeLines: [
            'def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:',
            '    prev, curr = None, head',
            '    while curr:',
            '        nxt = curr.next',
            '        curr.next = prev',
            '        prev, curr = curr, nxt',
            '    return prev'
          ],
          lineAnnotations: [
            {
              line: 2,
              title: 'Pointer Init',
              explanation: 'Initializes prev to None and curr to head.',
              type: 'init'
            },
            {
              line: 5,
              title: 'Link Reversal',
              explanation: 'Points curr.next back to prev.',
              type: 'state'
            },
            {
              line: 7,
              title: 'Return Head',
              explanation: 'Returns prev node as new list head.',
              type: 'return'
            }
          ]
        },
        JavaScript: {
          language: 'JavaScript',
          codeLines: [
            'function reverseList(head) {',
            '  let prev = null, curr = head;',
            '  while (curr !== null) {',
            '    const next = curr.next;',
            '    curr.next = prev;',
            '    prev = curr;',
            '    curr = next;',
            '  }',
            '  return prev;',
            '}'
          ],
          lineAnnotations: [
            {
              line: 2,
              title: 'JS Pointer Init',
              explanation: 'Initializes prev = null and curr = head.',
              type: 'init'
            },
            {
              line: 5,
              title: 'Pointer Reassignment',
              explanation: 'Assigns curr.next = prev.',
              type: 'state'
            },
            {
              line: 9,
              title: 'Return New Head',
              explanation: 'Returns prev pointer as head.',
              type: 'return'
            }
          ]
        },
        'C++': {
          language: 'C++',
          codeLines: [
            'ListNode* reverseList(ListNode* head) {',
            '    ListNode *prev = nullptr, *curr = head;',
            '    while (curr) {',
            '        ListNode* nxt = curr->next;',
            '        curr->next = prev;',
            '        prev = curr;',
            '        curr = nxt;',
            '    }',
            '    return prev;',
            '}'
          ],
          lineAnnotations: [
            {
              line: 2,
              title: 'C++ Nullptr Init',
              explanation: 'Sets prev to nullptr.',
              type: 'init'
            },
            {
              line: 5,
              title: 'Pointer Reversal',
              explanation: 'Rebinds curr->next = prev.',
              type: 'state'
            },
            {
              line: 9,
              title: 'Return ListNode*',
              explanation: 'Returns prev pointer.',
              type: 'return'
            }
          ]
        },
        Java: {
          language: 'Java',
          codeLines: [
            'public ListNode reverseList(ListNode head) {',
            '    ListNode prev = null, curr = head;',
            '    while (curr != null) {',
            '        ListNode next = curr.next;',
            '        curr.next = prev;',
            '        prev = curr;',
            '        curr = next;',
            '    }',
            '    return prev;',
            '}'
          ],
          lineAnnotations: [
            {
              line: 2,
              title: 'Java ListNode References',
              explanation: 'Sets prev = null and curr = head.',
              type: 'init'
            },
            {
              line: 5,
              title: 'Next Pointer Overwrite',
              explanation: 'Sets curr.next = prev.',
              type: 'state'
            },
            {
              line: 9,
              title: 'Return prev',
              explanation: 'Returns prev reference as reversed head.',
              type: 'return'
            }
          ]
        }
      }
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

        {/* Stacked Problem Cards with Single-View Active Recall Trays */}
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
