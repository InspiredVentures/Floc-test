
class MockLocalStorage {
    private store: Record<string, string> = {};

    get length() {
        return Object.keys(this.store).length;
    }

    key(index: number) {
        return Object.keys(this.store)[index] || null;
    }

    getItem(key: string) {
        return this.store[key] || null;
    }

    setItem(key: string, value: string) {
        this.store[key] = value;
    }

    removeItem(key: string) {
        delete this.store[key];
    }

    clear() {
        this.store = {};
    }
}

// Global mock
const localStorage = new MockLocalStorage();

// Constants
const NUM_COMMUNITIES = 200;
const POSTS_PER_COMMUNITY = 10;
const NUM_SEARCHES = 500;

// Setup Data
console.log(`Setting up data: ${NUM_COMMUNITIES} communities with ${POSTS_PER_COMMUNITY} posts each...`);
const allPostIds: string[] = [];
const mockPostIndex: Record<string, string> = {};

for (let i = 0; i < NUM_COMMUNITIES; i++) {
    const communityId = `c${i}`;
    const posts: any[] = [];
    for (let j = 0; j < POSTS_PER_COMMUNITY; j++) {
        const postId = `post-${communityId}-${j}`;
        posts.push({
            id: postId,
            content: `Post content ${j} in community ${i}`,
            comments: []
        });
        allPostIds.push(postId);

        // Build index for optimized version
        mockPostIndex[postId] = communityId;
    }
    localStorage.setItem(`mock_posts_${communityId}`, JSON.stringify(posts));
}

// Also save the index to simulate persistent storage
localStorage.setItem('mock_post_index', JSON.stringify(mockPostIndex));

console.log(`Total posts: ${allPostIds.length}`);
console.log(`LocalStorage items: ${localStorage.length}`);

// Benchmark Classic
console.log('\n--- Benchmarking Classic Loop ---');
const startClassic = performance.now();

let foundCountClassic = 0;

for (let i = 0; i < NUM_SEARCHES; i++) {
    const targetPostId = allPostIds[Math.floor(Math.random() * allPostIds.length)];

    // Simulate addComment logic (classic)
    for (let k = 0; k < localStorage.length; k++) {
        const key = localStorage.key(k);
        if (key?.startsWith('mock_posts_')) {
            const posts = JSON.parse(localStorage.getItem(key) || '[]');
            const postIndex = posts.findIndex((p: any) => p.id === targetPostId);
            if (postIndex !== -1) {
                // Found it!
                // Simulate update
                posts[postIndex].comments.push({ id: 'new-comment' });
                localStorage.setItem(key, JSON.stringify(posts));
                foundCountClassic++;
                break;
            }
        }
    }
}

const endClassic = performance.now();
console.log(`Classic Time: ${(endClassic - startClassic).toFixed(2)}ms for ${NUM_SEARCHES} searches`);
console.log(`Average: ${((endClassic - startClassic) / NUM_SEARCHES).toFixed(4)}ms per search`);


// Reset Data (to be fair, although writes are minimal impact compared to parsing loop)
// For simplicity, we assume data state is roughly same or doesn't matter for read heavy part.


// Benchmark Optimized
console.log('\n--- Benchmarking Optimized ---');
const startOptimized = performance.now();

let foundCountOptimized = 0;

for (let i = 0; i < NUM_SEARCHES; i++) {
    const targetPostId = allPostIds[Math.floor(Math.random() * allPostIds.length)];

    // Simulate addComment logic (optimized)
    const indexStr = localStorage.getItem('mock_post_index');
    const index = indexStr ? JSON.parse(indexStr) : {};
    const communityId = index[targetPostId];

    if (communityId) {
        const key = `mock_posts_${communityId}`;
        const postsStr = localStorage.getItem(key);
        if (postsStr) {
            const posts = JSON.parse(postsStr);
            const postIndex = posts.findIndex((p: any) => p.id === targetPostId);
            if (postIndex !== -1) {
                // Found it!
                posts[postIndex].comments.push({ id: 'new-comment' });
                localStorage.setItem(key, JSON.stringify(posts));
                foundCountOptimized++;
            }
        }
    } else {
        // Fallback logic (not triggered in this test as index is fully populated)
    }
}

const endOptimized = performance.now();
console.log(`Optimized Time: ${(endOptimized - startOptimized).toFixed(2)}ms for ${NUM_SEARCHES} searches`);
console.log(`Average: ${((endOptimized - startOptimized) / NUM_SEARCHES).toFixed(4)}ms per search`);

const improvement = (endClassic - startClassic) / (endOptimized - startOptimized);
console.log(`\nSpeedup: ${improvement.toFixed(1)}x`);
