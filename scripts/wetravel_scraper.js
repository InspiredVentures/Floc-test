
/**
 * WETRAVEL BROWSER CONSOLE SCRAPER
 * 
 * Instructions:
 * 1. Go to your WeTravel dashboard: https://inspired.wetravel.com/user/my_trips
 * 2. Ensure your trips list is visible.
 * 3. Open Developer Tools (F12 or Right Click -> Inspect).
 * 4. Go to the "Console" tab.
 * 5. Copy and paste the ENTIRE script below and hit Enter.
 * 6. Copy the JSON output and paste it into `data/source_trips.ts`.
 */

(function () {
    console.log("Analyzing page for trips...");

    // Arrays to hold potential data
    const trips = [];

    // Try to find card elements based on common patterns
    // WeTravel uses various frameworks, so we look for generic "card" or "list-item" structures
    // A good heuristic is looking for elements with an image and a price

    // Strategy 1: Look for common trip card containers
    let cards = Array.from(document.querySelectorAll('div[class*="card"], div[class*="Card"], div[class*="trip-item"]'));

    // Fallback: If no cards found, look for list rows
    if (cards.length === 0) {
        cards = Array.from(document.querySelectorAll('tr, li'));
    }

    // Fallback 2: Look for any div with an image and "price" or dates
    if (cards.length === 0) {
        const allDivs = Array.from(document.querySelectorAll('div'));
        cards = allDivs.filter(div => {
            const hasImg = div.querySelector('img');
            const text = div.innerText || "";
            return hasImg && (text.includes('$') || text.match(/\d{4}/)); // Has image and price or year
        });
        // Filter out nested divs, keep only top-level (heuristic)
        cards = cards.filter(c => c.clientHeight > 100);
    }

    console.log(`Found ${cards.length} potential trip elements.`);

    cards.forEach((card, index) => {
        try {
            // Extract Title: Usually an H3, H4, or bold text
            let title = card.querySelector('h3, h4, h5, .title, [class*="title"]')?.innerText;
            if (!title) {
                // Find largest text node? roughly
                const bolds = Array.from(card.querySelectorAll('strong, b'));
                if (bolds.length > 0) title = bolds[0].innerText;
            }

            // Extract Image
            let img = card.querySelector('img')?.src;
            // Filter out small icons or user avatars if possible
            if (img && img.includes('avatar')) img = null;

            // Extract Price
            const text = card.innerText || "";
            const priceMatch = text.match(/[$€£]\s?[\d,]+(\.\d{2})?/);
            const price = priceMatch ? priceMatch[0] : "TBD";

            // Extract Dates: Pattern like "Jan 01 - Jan 10" or "YYYY"
            // Looking for Month Short names
            const dateMatch = text.match(/([A-Z][a-z]{2}\s\d{1,2}.{1,3}[A-Z][a-z]{2}\s\d{1,2}|[A-Z][a-z]{2}\s\d{1,2},\s\d{4})/);
            const dates = dateMatch ? dateMatch[0] : "Dates TBD";

            // Extract Status (just guessing based on text)
            let status = 'PLANNING';
            if (text.toLowerCase().includes('confirmed') || text.toLowerCase().includes('book now')) status = 'CONFIRMED';
            if (text.toLowerCase().includes('draft')) status = 'DRAFT';

            // Only add if it looks like a trip (has title and (price or date))
            if (title && (price !== "TBD" || dates !== "Dates TBD")) {
                // Clean up title
                title = title.replace(/\n/g, ' ').trim();

                trips.push({
                    id: `wt-import-${index}`,
                    title: title,
                    destination: 'Unknown Destination', // Hard to extract reliably without specific class
                    dates: dates,
                    price: price,
                    image: img || 'https://via.placeholder.com/800x600?text=No+Image',
                    status: status,
                    membersCount: 0,
                    communityId: '', // User needs to fill this
                    wetravelId: '' // User fills if they know it
                });
            }
        } catch (e) {
            console.warn("Skipping a card due to error", e);
        }
    });

    // Deduplicate based on title
    const uniqueTrips = trips.filter((t, index, self) =>
        index === self.findIndex((u) => (
            u.title === t.title && u.dates === t.dates
        ))
    );

    console.log("------------------------------------------");
    console.log("✅ SCRAPING COMPLETE");
    console.log(`Found ${uniqueTrips.length} unique trips.`);
    console.log("Copy the JSON below:");
    console.log("------------------------------------------");
    console.log(JSON.stringify(uniqueTrips, null, 2));
    console.log("------------------------------------------");

    // Also copy to clipboard if possible
    try {
        navigator.clipboard.writeText(JSON.stringify(uniqueTrips, null, 2));
        console.log("🎉 JSON copied to clipboard automatically!");
    } catch (e) {
        console.log("(Could not auto-copy to clipboard, please manually copy the JSON above)");
    }

})();
