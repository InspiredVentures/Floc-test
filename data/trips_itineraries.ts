
export interface ItineraryDay {
    day: string;
    title: string;
    desc: string;
    image?: string;
}

export interface TripDate {
    start: string;
    end: string;
    year: number;
    bookingLink?: string;
    availability?: 'Open' | 'Limited' | 'Sold Out';
}

export interface TripContent {
    mission: string;
    whyJoin: string[];
    givingBack: string;
    itinerary: ItineraryDay[];
    inclusions: string[];
    exclusions: string[];
    highlights: string[];
    dates?: TripDate[];
}

export const TRIP_CONTENT: { [key: string]: TripContent } = {
    'borneo': {
        mission: "Join us for an unforgettable journey through the heart of Malaysian Borneo—a land of lush rainforests, rich Indigenous culture, and extraordinary wildlife. This 13-day give-back tour blends immersive adventure with social impact, offering travellers the chance to explore some of the world’s most biodiverse regions while contributing meaningfully to local communities and conservation efforts.",
        whyJoin: [
            "Make a Difference: Your participation supports ethical wildlife conservation, social care projects, and Indigenous-owned tourism initiatives",
            "Travel with Purpose: Experience Borneo’s people, animals, and ecosystems in a way that uplifts and protects what makes them unique",
            "Unforgettable Memories: From dawn jungle drives to riverside wildlife sightings, this journey is packed with powerful, perspective-shifting moments"
        ],
        givingBack: "This trip embodies community-focused tourism, putting locals at the heart of the experience. It’s about working with the community, not just visiting. By listening to local needs and collaborating on sustainable projects like building clay stoves and helping with wildlife care, the trip ensures tourism benefits the people rather than exploiting them. Through immersive cultural exchange and impactful development work, this journey uses tourism as a force for good—empowering communities and fostering deep, meaningful connections that leave a lasting legacy for both travelers and locals.",
        itinerary: [
            {
                day: '01',
                title: 'Arrival in Kota Kinabalu',
                desc: 'Welcome to Sabah! Upon arrival at Kota Kinabalu International Airport, our team will be there to greet you and transfer you to the Grandis Hotel. Take some time to settle in and freshen up after your flight. In the late afternoon, we’ll gather at the Piano Lounge for refreshments and a chance to get to know your fellow travellers. We’ll be joined by our expert local guides, Albert and John, for a comprehensive briefing on Bornean culture and the days ahead. To kick off the journey, we head to the Kampung Nelayan Seafood Village for a traditional welcome dinner, complete with a cultural dance performance.',
                image: 'https://static.wixstatic.com/media/1d3653_7b75288b7b294e0a8e21154f97a9461d~mv2.jpg'
            },
            {
                day: '02',
                title: 'Gaya Island & Snorkeling',
                desc: 'Start your morning with a short boat ride to the Floating Club House at Gaya Island. Here, the day is yours to enjoy—choose from kayaking, paddle boarding, or simply soaking up the sun on the deck. After a delicious lunch served on a private yacht, we’ll cruise around the islands, keeping an eye out for diverse birdlife, mischievous proboscis monkeys, and the elusive red giant flying squirrels. As the sun sets, we return to the mainland for a dinner at a Chinese restaurant, where you’ll taste dishes influenced by local Bornean flavours.',
                image: 'https://static.wixstatic.com/media/1d3653_9e5d7c2281e14c99b2603759c0d1f485~mv2.jpg'
            },
            {
                day: '03',
                title: 'Mari Mari Cultural Village',
                desc: 'Dive deep into Borneo’s heritage with a visit to the Mari Mari Cultural Village. This living museum showcases the traditional houses and lifestyles of the five main tribes of Sabah. You’ll learn about their history, culinary traditions, and survival skills as they preserve their unique heritage. Prepare to get involved—you might even be invited to join a traditional bamboo dance! After a shared lunch with our hosts, we’ll visit iconic local attractions like the stunning Likas Floating Mosque, a marvel of modern Islamic architecture sitting on a man-made lagoon.',
                image: 'https://static.wixstatic.com/media/1d3653_54ac9f2c7e9d437ea6dbed547dfe9ccc~mv2.jpg'
            },
            {
                day: '04',
                title: 'Aura Kindergarten & River Rafting',
                desc: 'Today we head to the rural district of Kiulu to visit the Aura Kindergarten. Here, you’ll engage with the children and staff, learning about the local education system and community initiatives. Afterwards, it’s time for a bit of adventure as we head to the Kiulu River. Enjoy a fun, easy-going rafting experience (grade 1–2 rapids) that takes you through spectacular bamboo groves and lush forests. It’s the perfect mix of excitement and scenery. We’ll wrap up the morning with a hearty BBQ lunch by the riverbank before returning to Kota Kinabalu.',
                image: 'https://static.wixstatic.com/media/1d3653_7d26a3d8adfa454a98afee92a3f93c49~mv2.jpg'
            },
            {
                day: '05',
                title: 'Kinabalu National Park',
                desc: 'We leave the coast behind and travel inland to the UNESCO World Heritage Site of Kinabalu National Park. En route, we’ll stop at "Pekan Nabalu" for a photo opportunity with the majestic Mount Kinabalu as our backdrop. We’ll also visit the Desa Cattle Farm, often called the "New Zealand of Sabah," and explore the traditional markets in Kundasang, where fresh produce and local crafts abound. Dinner tonight features local specialities in a cooler mountain climate.',
                image: 'https://static.wixstatic.com/media/1d3653_71d3787b3824428cba8e4154029b665e~mv2.jpg'
            },
            {
                day: '06',
                title: 'Poring Hot Springs & Deramakot',
                desc: 'Explore the famous Poring Hot Springs, known for their therapeutic sulphur baths and the giant bamboo that grows in the area. Take a walk on the 43m tall canopy walkway for a bird’s-eye view of the rainforest. Later, we drive to the Deramakot Forest Reserve, a model for sustainable forest management. As we approach our lodge, keep your eyes peeled for wildlife at dusk. After settling in and having dinner, we’ll embark on our first night Wildlife Drive, searching for nocturnal creatures like civets, leopard cats, and maybe even a clouded leopard.',
                image: 'https://static.wixstatic.com/media/1d3653_82e6628a7dd24231b5d2bf9429d90cb6~mv2.jpg'
            },
            {
                day: '07',
                title: 'Deramakot Dawn Drive',
                desc: 'It’s a 4:00 AM wake-up call for the "early birds" to witness dawn breaking over the rainforest. The morning drive offers a unique chance to see the forest wake up and observe animals starting their day. After the drive, return to the lodge for a well-deserved breakfast and a nap. In the afternoon, we’ll trek the Domingo Trail, learning about the medicinal plants and diverse flora of the region. We round off the day with another thrilling night-time Wildlife Drive.',
                image: 'https://static.wixstatic.com/media/1d3653_1f5a90f034c14615ad662363af84eaa4~mv2.jpg'
            },
            {
                day: '08',
                title: 'Borneo Elephant Sanctuary',
                desc: 'We check out of Deramakot and travel to Kinabatangan, one of Borneo’s premier wildlife regions. Our destination is the Borneo Elephant Sanctuary (BES), specifically dedicated to the conservation of the endangered Borneo pygmy elephant. Here, you will meet the team and learn about the critical challenges these gentle giants face, from habitat loss to human-elephant conflict. You’ll get an introduction to the sanctuary’s daily operations and the vital work being done to protect the species.',
                image: 'https://images.unsplash.com/photo-1585675402636-64560b3d686f?q=80&w=800'
            },
            {
                day: '09',
                title: 'Volunteering & Bat Exodus',
                desc: 'Get hands-on with volunteering activities at the sanctuary. Tasks may include preparing food for the elephants, cleaning enclosures, or helping with maintenance projects that support the sanctuary’s infrastructure. Your efforts directly contribute to the elephants’ well-being. In the evening, we travel to Gomantong Caves to witness the incredible bat exodus. Watch in awe as millions of bats spiral out of the cave entrance at dusk, while bat hawks swoop in for their dinner—a natural spectacle that needs to be seen to be believed.',
                image: 'https://static.wixstatic.com/media/1d3653_f9319f1f55444298bf0d2763516d8124~mv2.jpg'
            },
            {
                day: '10',
                title: 'Kinabatangan Wildlife Corridor',
                desc: 'We travel to Ulu Melapi for a deep immersion into the Kinabatangan river system. This area is a biodiversity hotspot. An afternoon river cruise offers excellent chances to spot iconic wildlife such as proboscis monkeys, macaques, and hornbills along the riverbanks. After dinner, we’ll take a nocturnal jungle walk to see the forest come alive after dark, looking for sleeping birds, insects, and reptiles.',
                image: 'https://static.wixstatic.com/media/1d3653_6107ed8a73c34dcd86b697911d6c06d3~mv2.jpg'
            },
            {
                day: '11',
                title: 'River Immersion',
                desc: 'Today is dedicated to the river. We’ll embark on early morning and late afternoon river cruises, the prime times for wildlife viewing. This is your best chance to capture stunning photographs of Borneo’s unique biodiversity in its natural habitat. Between cruises, relax at the lodge or take a guided walk to learn more about the riverine ecosystem.',
                image: 'https://static.wixstatic.com/media/1d3653_0c33be4fd8774879874a5a2419b4ee25~mv2.jpg'
            },
            {
                day: '12',
                title: 'Sepilok & Flying Squirrels',
                desc: 'We visit the Labuk Bay Proboscis Monkey Sanctuary to see these unique primates up close during their feeding time. Afterwards, we travel to Sepilok and check into the Sepilok Jungle Resort. In the late afternoon, we visit the Rainforest Discovery Centre. We’ll walk along the steel canopy bridge at dusk, hoping to see the endemic red giant flying squirrels gliding between the trees—a magical end to the day.',
                image: 'https://static.wixstatic.com/media/1d3653_5096da602ce3422b9e7f38af2617311b~mv2.jpg'
            },
            {
                day: '13',
                title: 'Orangutans & Sun Bears',
                desc: 'Our final morning is spent visiting two world-famous conservation centres. First, the Sepilok Orangutan Rehabilitation Centre, where we’ll watch young orangutans learning survival skills at the outdoor nursery. Then, we visit the Bornean Sun Bear Conservation Centre to learn about the world’s smallest bear and the efforts to rescue and rehabilitate them. After these inspiring visits, we transfer to Sandakan Airport for your onward flight, carrying memories of an incredible journey.',
                image: 'https://static.wixstatic.com/media/1d3653_c965506097ea46d29008134dedaecb36~mv2.jpg'
            }
        ],
        inclusions: [
            "Contribution to Borneo Elephant Sanctuary",
            "All internal transfers and 4x4 transport",
            "Expert local guides (Albert & John)",
            "Accommodation as per itinerary (Grandis Hotel, Deramakot Lodge, Homestays)",
            "Most meals (Breakfast, Lunch, Dinner)",
            "Park entrance fees and conservation permits"
        ],
        exclusions: [
            "International flights",
            "Personal travel insurance (Compulsory)",
            "Personal expenses and laundry",
            "Alcoholic beverages"
        ],
        highlights: [
            "Volunteer at the Borneo Elephant Sanctuary",
            "13-day immersive journey",
            "Deramakot Forest Reserve Night Drives",
            "Sepilok Orangutan Rehabilitation Centre",
            "Mari Mari Cultural Village Experience"
        ],
        dates: [
            { start: "12 Apr", end: "24 Apr", year: 2026, bookingLink: "https://inspired.wetravel.com/checkout_embed?uuid=67314500&source=direct_link", availability: "Open" },
            { start: "17 May", end: "29 May", year: 2026, bookingLink: "https://inspired.wetravel.com/checkout_embed?uuid=67314500&source=direct_link", availability: "Open" },
            { start: "04 Sep", end: "16 Sep", year: 2026, bookingLink: "https://inspired.wetravel.com/checkout_embed?uuid=67314500&source=direct_link", availability: "Open" },
            { start: "29 Oct", end: "10 Nov", year: 2026, bookingLink: "https://inspired.wetravel.com/checkout_embed?uuid=45546236&source=direct_link", availability: "Open" }
        ]
    },
    'uganda-rwanda': {
        mission: "Track gorillas in Bwindi and chimps in Nyungwe. This 15-day journey includes meaningful voluntary activity at Uganda Lodge and supporting endangered grey crowned cranes in Rwanda.",
        whyJoin: [
            "Face-to-face with Mountain Gorillas in their natural habitat",
            "Chimpanzee trekking in the ancient Nyungwe rainforest",
            "Meaningful volunteering at Uganda Lodge and Umusambi Village",
            "Support endangered Grey Crowned Cranes conservation"
        ],
        givingBack: "Join us in supporting local education and healthcare at Uganda Lodge, and contribute to the protection of Rwanda's wildlife through specialized conservation projects.",
        itinerary: [
            {
                day: '01',
                title: 'Arrival in Entebbe',
                desc: 'Welcome at the airport and transfer to De Rain eco hotel on the shores of Lake Victoria. Orientation over evening drinks as we look out across the vast expanse of the lake, breathing in the fresh air of the Pearl of Africa. Our team will guide you through the upcoming 15-day mission, preparing you for the deep immersion into the local ecosystem and humanitarian projects ahead.',
                image: 'https://static.wixstatic.com/media/06d336_38a3dc5ddcf34a0284d35b81847aa533~mv2.jpg'
            },
            {
                day: '02',
                title: 'Lake Mburo Walking Safari',
                desc: 'Drive to Lake Mburo for a unique walking safari among zebras, impalas, and elands. Unlike traditional jeep safaris, being on foot allows you to connect more intimately with the rhythms of the wild. We’ll learn about the delicate balance of the savanna ecosystem and the efforts being made by local rangers to protect these corridors from human-wildlife conflict.',
                image: 'https://images.unsplash.com/photo-1547970810-dc1eac37d174?q=80&w=800'
            },
            {
                day: '03',
                title: 'Boat Ride & Ruhanga',
                desc: 'Morning boat ride on Lake Mburo, searching for hippos and crocodiles, then travel to Ruhanga to check in at Uganda Lodge. This journey takes us through the heart of rural Uganda, passing rolling hills and vibrant local markets. As we arrive at the lodge, we’ll meet the community leaders we’ll be partnering with for the next few days.',
                image: 'https://static.wixstatic.com/media/06d336_d7d5e645082648bd862cae190ed115ff~mv2.jpg'
            },
            {
                day: '04-06',
                title: 'Volunteering at Uganda Lodge',
                desc: 'Choose between helping at the school, McNeil Medical Centre, or practical building projects. This is where the real work begins—partnering with local teachers and medical staff to support the community’s long-term resilience. Whether you’re reading to students or helping with infrastructure, your presence fuels the education and healthcare systems that serve thousands in the Ruhanga region.',
                image: 'https://static.wixstatic.com/media/06d336_090bbad39acd45c0a13dd61d7f47fc7f~mv2.jpg'
            },
            {
                day: '07',
                title: 'Bwindi Impenetrable Forest',
                desc: 'Rocky road journey to Bwindi with breathtaking mountain views and school visits. We’ll wind through some of the most spectacular terrain in East Africa, reaching the edges of the ancient Bwindi Impenetrable Forest. Here, the rainforest is dense and alive, home to the elusive mountain gorilla and a wealth of endemic bird species.',
                image: 'https://static.wixstatic.com/media/06d336_ff4d7dda45cd41fab1262ab102f2fddc~mv2.jpg'
            },
            {
                day: '08',
                title: 'Gorilla Tracking',
                desc: 'An unforgettable morning tracking mountain gorillas in the wild. Our guides will lead us into the heart of the forest, sharing their deep knowledge of gorilla behavior and conservation. For those who choose not to trek, we’ll spend the morning visiting local community projects and cooperatives, learning about how tourism directly supports the protection of these majestic animals.',
                image: 'https://static.wixstatic.com/media/11062b_55e4be1e75564866b6c28290f9a9d271~mv2.png'
            },
            {
                day: '09',
                title: 'Crossing into Rwanda',
                desc: 'Travel day into the "Land of a Thousand Hills". We’ll cross the border and begin the drive to Kigali, witnessing the dramatic change in landscape and culture. As we approach the capital, we’ll see the scars and the resilience of a nation that has moved with incredible purpose toward reconciliation and growth.',
                image: 'https://static.wixstatic.com/media/06d336_706cf716da344971815f5974a1ffa176~mv2.jpg'
            },
            {
                day: '10',
                title: 'Kigali Genocide Memorial',
                desc: 'Reflective visit to the memorial followed by a drive to Akagera National Park. A powerful morning dedicated to understanding Rwanda’s modern history and its path to peace. Afterwards, we’ll head east to the savanna of Akagera, where we’ll transition from cultural reflection to wildlife immersion in the country’s only Big Five park.',
                image: 'https://static.wixstatic.com/media/06d336_a844725a4a4440f08fddb4e834ea9121~mv2.jpg'
            },
            {
                day: '11',
                title: 'Akagera Safari',
                desc: 'Full day game drive searching for lions, rhinos, and elephants in Akagera. We’ll traverse the varied landscape of lakes, marshes, and rolling plains, observing how the park’s restoration has revitalized local populations. The afternoon offers a boat safari on Lake Ihema, providing a unique vantage point to see hippos and rare birdlife.',
                image: 'https://images.unsplash.com/photo-1541336496-c1494665f84d?q=80&w=800'
            },
            {
                day: '12',
                title: 'Umusambi Village & Nyungwe',
                desc: 'Help care for rescued Grey Crowned Cranes at Umusambi Village before driving to the ancient Nyungwe rainforest. We’ll partner with the Rwanda Wildlife Conservation Association to support their crane rehabilitation efforts, gaining insight into the challenges of protecting these iconic birds before we head into the deep forest of the west.',
                image: 'https://static.wixstatic.com/media/06d336_17e5fc414d0c40ae86c32e94391cf609~mv2.jpg'
            },
            {
                day: '13',
                title: 'Chimpanzee Trekking',
                desc: 'Early morning trek into the ancient Nyungwe forest to observe fast-moving primates. This is one of the world’s oldest and most biodiverse rainforests, where we’ll track chimpanzees and colobus monkeys through the high canopy. The experience is intimate and powerful, highlighting the importance of preserving these critical habitats.',
                image: 'https://static.wixstatic.com/media/06d336_83fba76cf312485d8ce8d60c79a11592~mv2.png'
            },
            {
                day: '14',
                title: 'Nyamirambo Women’s Centre',
                desc: 'Cooking class and cooperative tour followed by a celebratory farewell dinner in Kigali. We’ll spend the day at the Nyamirambo Women’s Centre, participating in their cooking and weaving cooperatives, seeing how local empowerment directly fuels economic resilience. We’ll celebrate our 15-day journey with a final feast featuring the flavors of Rwanda.',
                image: 'https://static.wixstatic.com/media/11062b_2381e8a6e7444f4f902e7b649aa3f0ac~mv2.png'
            },
            {
                day: '15',
                title: 'Departure',
                desc: 'Airport transfer for onward flights from Kigali International. As we bid farewell to the Land of a Thousand Hills, we take with us the stories, connections, and impact of a journey that has truly been more than just travel.',
                image: 'https://static.wixstatic.com/media/06d336_f991ee242fe9457abc75957db1d47cff~mv2.png'
            }
        ],
        inclusions: [
            "Gorilla tracking permit (1 per person)",
            "Chimpanzee tracking permit (1 per person)",
            "All road transport in private 4x4",
            "Volunteering projects at Uganda Lodge & Umusambi Village",
            "Experienced English-speaking guides",
            "Vamoos app access for tour details"
        ],
        exclusions: [
            "International flights",
            "Travel insurance (Compulsory)",
            "Visas for Uganda & Rwanda",
            "Alcoholic drinks and tips"
        ],
        highlights: [
            "Face-to-face with Mountain Gorillas",
            "Chimpanzee trekking in Nyungwe",
            "3-day community volunteering mission",
            "Rescued Grey Crowned Cranes project",
            "Nyamirambo Women's Cooperative"
        ],
        dates: [
            { start: "18 Feb", end: "04 Mar", year: 2026, bookingLink: "https://inspired.wetravel.com/checkout_embed?uuid=23494731&source=direct_link", availability: "Limited" },
            { start: "26 Jul", end: "09 Aug", year: 2026, bookingLink: "https://inspired.wetravel.com/checkout_embed?uuid=67951547&source=direct_link", availability: "Open" }
        ]
    },
    'bhutan': {
        mission: "Immerse yourself in a living Himalayan kingdom where cultural preservation, environmental protection, and mindful travel are not ideals, but everyday practice. On this journey, we move slowly and intentionally through valleys, forests, and sacred sites, connecting with the rhythms of Bhutanese culture.",
        whyJoin: [
            "A spectacular Himalayan flight from Kathmandu to Paro, passing Everest and Kanchenjunga.",
            "Immerse into a living Himalayan kingdom where tradition is carefully preserved.",
            "Cross Dochula Pass with its 108 chortens and walk the ancient Trans-Bhutan Trail.",
            "Complete the journey with the iconic hike to Taktshang Monastery (Tiger’s Nest)."
        ],
        givingBack: "Your participation supports Bhutan’s low-impact, high-value tourism model, contributing to the Sustainable Tourism Fee which funds conservation and infrastructure projects across the kingdom.",
        itinerary: [
            { day: '01', title: 'Arrival in Kathmandu', desc: "Welcome to Nepal! Join the group for an orientation and a welcome dinner at the iconic Kathmandu Guest House. Meet your fellow travelers and prep for the cinematic flight into the 'Land of the Thunder Dragon' tomorrow.", image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800' },
            { day: '02', title: 'Fly to Paro & Thimphu', desc: "A spectacular Himalayan flight past Everest and Bhutan’s sacred peaks. Upon arrival in Paro, visit the Memorial Chorten and the immense Buddha Dordenma overlooking the capital of Thimphu. Experience the serene atmosphere of these sacred sites.", image: 'https://static.wixstatic.com/media/1d3653_232266504bf547daa32ce9c70aae5cbb~mv2.jpg' },
            { day: '03', title: 'Buddha Dordenma & Thimphu', desc: "Walk forested trails from Kuensel Phodrang to Changangkha Lhakhang, gaining insight into Bhutan’s spiritual and community life. Explore the Folk Heritage Museum and Royal Textile Museum to understand local craftsmanship and heritage.", image: 'https://static.wixstatic.com/media/1d3653_d1c7f4c8738f4f5bbcfbb6cacebdea85~mv2.jpg' },
            { day: '04', title: 'Dochula Pass & Trans-Bhutan Trail', desc: "Cross the Dochula Pass (3,100m) with its 108 chortens and panoramic Himalayan views. Descend through old-growth forests on a restored section of the ancient Trans-Bhutan Trail, once the country's primary artery.", image: 'https://static.wixstatic.com/media/11062b_55e4be1e75564866b6c28290f9a9d271~mv2.png' },
            { day: '05', title: 'Punakha Dzong & River Float', desc: "Visit Punakha Dzong, Bhutan’s most beautiful fortress, set at the meeting point of two sacred rivers. Enjoy a gentle river float and a hike to Khamsum Yuelley Namgyal temple for panoramic valley views.", image: 'https://static.wixstatic.com/media/11062b_2381e8a6e7444f4f902e7b649aa3f0ac~mv2.png' },
            { day: '06', title: 'Black-Necked Cranes & Paro', desc: "Walk the Gangtey Nature Trail through the winter habitat of the endangered black-necked cranes. Visit the Gangtey Gompa monastery before returning to Paro to share regional dishes unique to the valley.", image: 'https://static.wixstatic.com/media/1d3653_651fe57951874276b946fe7c733e7acb~mv2.jpg' },
            { day: '07', title: 'Tiger’s Nest Monastery', desc: "Complete the journey with the iconic hike to Taktshang (Tiger’s Nest), revered as Bhutan's most sacred spiritual site. Celebrate the achievement with a traditional hot-stone bath at a local farmhouse.", image: 'https://images.unsplash.com/photo-1578513304533-35619550cedc?q=80&w=800' },
            { day: '08', title: 'Departure', desc: "Farewell breakfast and return flight to Kathmandu. Transfer to the city for onward travel or stay to explore more of the Himalayan capital.", image: 'https://static.wixstatic.com/media/06d336_f991ee242fe9457abc75957db1d47cff~mv2.png' }
        ],
        inclusions: [
            "Sustainable Tourism Fee (US$600 Gov tax)",
            "Visa fees and monument entrance fees",
            "Round-trip airfare Kathmandu to Paro",
            "Traditional hot-stone bath experience",
            "English-speaking tour leader and driver",
            "All meals including evening tea"
        ],
        exclusions: [
            "International flights to Kathmandu",
            "Travel and medical insurance",
            "Pony hire for Tiger’s Nest (Optional)",
            "Personal expenses and tips"
        ],
        highlights: [
            "Hike to Tiger’s Nest (Taktshang)",
            "Flight past Mount Everest",
            "Himalayan Hot Stone Bath",
            "Black-Necked Crane conservation area",
            "Trans-Bhutan Trail walking"
        ],
        dates: [
            { start: "27 Nov", end: "03 Dec", year: 2026, bookingLink: "https://wetravel.com/checkout_embed?uuid=6359753009&source=direct_link", availability: "Open" },
            { start: "07 May", end: "13 May", year: 2027, bookingLink: "https://wetravel.com/checkout_embed?uuid=8662416307&source=direct_link", availability: "Open" },
            { start: "26 Nov", end: "02 Dec", year: 2027, bookingLink: "https://wetravel.com/checkout_embed?uuid=4224057353&source=direct_link", availability: "Open" }
        ]
    },
    'cambodia': {
        mission: "Join us on a journey to the heart of Southeast Asia and discover Cambodia from a new perspective! This 13-day ethical adventure combines breathtaking landscapes, meaningful cultural experiences, and genuine connections with local communities.",
        whyJoin: [
            "Make a Difference: Your participation directly supports local communities, ethical tourism, and landmine survivors.",
            "Travel with Heart: Experience Cambodia’s culture and history in a way that respects and uplifts its people.",
            "Explore Ancient Temples: From Angkor Wat to Ta Prohm, discover unique and mystical architectural wonders.",
            "Wildlife Conservation: Support ethical care for rescued elephants at the Cambodia Wildlife Sanctuary."
        ],
        givingBack: "This trip embodies community-focused tourism. By listening to local needs and collaborating on sustainable projects like donating wheelchairs and nutritious meals, the trip ensures tourism benefits the people rather than exploiting them.",
        itinerary: [
            { day: '01', title: 'Arrival in Phnom Penh', desc: "Our team will meet you at the airport and transfer you to Frangipani Royal Palace Hotel. In the afternoon, you are free to explore the riverfront or relax. We’ll gather in the early evening for our first group dinner.", image: 'https://static.wixstatic.com/media/06d336_485946e67c73434cb08e4828035f0f50~mv2.jpg' },
            { day: '02', title: 'Royal Palace & Wat Phnom', desc: "Dive into regal history at the Royal Palace, home to the Silver Pagoda. Explore Wat Phnom, a serene hilltop temple. After a local lunch, sample exotic fruits and shop for crafts at the local markets.", image: 'https://images.unsplash.com/photo-1565063075215-6b5791238917?q=80&w=800' },
            { day: '03', title: 'History Unveiled (S21 & Killing Fields)', desc: "A poignant and reflective exploration of the Khmer Rouge regime. Visit the S21 prison and the Killing Fields to understand Cambodia's modern history, followed by a sunset boat ride on the Mekong.", image: 'https://static.wixstatic.com/media/nsplsh_2e66977f87fa4119ae205fc07728f622~mv2.jpg' },
            { day: '04', title: 'Battambang Arts & Bats', desc: "Travel to Battambang, the creative hub. Experience a Phare Circus performance and witness the sunset spectacle of millions of bats emerging from the Phnom Sampov caves.", image: 'https://static.wixstatic.com/media/11062b_55e4be1e75564866b6c28290f9a9d271~mv2.png' },
            { day: '05', title: 'Soksabike Rural Immersion', desc: "Pedal through the countryside with Soksabike, supporting local families making rice paper and wine. This is an authentic look at rural life and sustainable community tourism.", image: 'https://static.wixstatic.com/media/04bfd5_9ac8b875715341a4a7899fa13f8f8718~mv2.jpeg' },
            { day: '06-08', title: 'Cambodia Wildlife Sanctuary', desc: "Spend three days at the Cambodia Wildlife Sanctuary. Get your hands dirty with ethical wildlife conservation, helping to care for rescued elephants and monkeys in a non-riding environment.", image: 'https://images.unsplash.com/photo-1564760055278-8d56b0008064?q=80&w=800' },
            { day: '09', title: 'APOPO Landmine Rats', desc: "Meet the 'HeroRats' detecting landmines with APOPO. Visit the Metta Karuna refugee reflection center to hear stories of resilience and reconciliation.", image: 'https://static.wixstatic.com/media/04bfd5_95aa69bf58514cfb9e12bf25a802a3ec~mv2.jpeg' },
            { day: '10', title: 'Wheelchair Workshop', desc: "Participate in an impactful mission to deliver EVA-donated wheelchairs to landmine survivors. Visit the Rokhak Women’s Cooperative to see local empowerment in action.", image: 'https://static.wixstatic.com/media/nsplsh_60a76e989391485da3a7deb5d424a635~mv2.jpg' },
            { day: '11', title: 'Angkor Wat Sunrise', desc: "An early start for the unforgettable sunrise over Angkor Wat. Spend the day on a guided spiritual tour of the 400-acre temple complex, including Ta Prohm and Bayon.", image: 'https://static.wixstatic.com/media/04bfd5_b203bad148b042b4a9ad82323ff8add2~mv2.jpeg' },
            { day: '12', title: 'Floating Village or Angkor Plus', desc: "Choose to return to the temples for deeper exploration or visit the floating villages of Tonle Sap by boat, seeing how communities live on the water.", image: 'https://static.wixstatic.com/media/nsplsh_38fda635c9ea4f4cb43e0f06a61c0255~mv2.jpg' },
            { day: '13', title: 'Farewell or Laos Extension', desc: "Final breakfast and departure, or continue the adventure with our optional 5-day Laos extension to Vientiane and Luang Prabang.", image: 'https://static.wixstatic.com/media/04bfd5_51b4937aeac44aa9a1fa09273fffaa81~mv2.jpeg' }
        ],
        inclusions: [
            "Wheelchair donation contribution",
            "Cambodia Wildlife Sanctuary stay",
            "All internal transport and guides",
            "Angkor Wat park passes",
            "Most meals (including vegan at sanctuary)",
            "APOPO HeroRats demonstration"
        ],
        exclusions: [
            "International flights",
            "Laos extension costs (Optional)",
            "Travel insurance",
            "Personal visas"
        ],
        highlights: [
            "Sunrise at Angkor Wat",
            "APOPO HeroRats Experience",
            "Wheelchair donation mission",
            "Ethical Elephant Sanctuary stay",
            "Phare Circus Performance"
        ],
        dates: [
            { start: "15 Feb", end: "27 Feb", year: 2026, bookingLink: "https://wetravel.com/checkout_embed?uuid=70707233&source=direct_link", availability: "Limited" },
            { start: "28 Sep", end: "10 Oct", year: 2026, bookingLink: "https://wetravel.com/checkout_embed?uuid=71043438&source=direct_link", availability: "Open" }
        ]
    },
    'nepal': {
        mission: "Join us for an unforgettable journey through the heart of the Himalayas. Mix spiritual discovery with vital wildlife conservation in some of the world's most breathtaking landscapes.",
        whyJoin: [
            "Make a Difference: Your participation supports ethical wildlife conservation including tigers and gharials.",
            "Travel with Purpose: Experience Nepal's incredible culture, wildlife and mountain scenery in an uplifting way.",
            "Unforgettable Memories: From mountain drives to rainforest wildlife sightings, this journey is packed with powerful moments."
        ],
        givingBack: "Over five days in the Chitwan region of Nepal we’ll work side by side with the team at the Nepal Tiger Trust. Our role includes setting up and monitoring cameras, tracking tiger and leopard paw prints and sharing vital information.",
        itinerary: [
            { day: '01', title: 'Arrival in Kathmandu', desc: "Arrive in Kathmandu where our team will greet you with marigold garlands and a silk prayer scarf. Drive through the lively streets to the iconic Kathmandu Guest House, our base in the heart of Thamel district. We'll gather for an orientation and enjoy our first group dinner together.", image: 'https://static.wixstatic.com/media/nsplsh_6237684246574f4f703273~mv2.jpg' },
            { day: '02', title: 'Bhaktapur: Ancient City & Newari Cuisine', desc: "Wander through brick-paved streets, temple squares and courtyards that feel largely unchanged for centuries. Take part in a hands-on pottery lesson with a local potter in the historic Pottery Square and enjoy a traditional Newari meal.", image: 'https://static.wixstatic.com/media/nsplsh_cb03932878794426bb6176d3c64afcdc~mv2.jpg' },
            { day: '03', title: 'UNESCO Sites & Optional Everest Flight', desc: "Optional early morning flight over the Himalayas to see the breadth and majesty of Mount Everest. Later, visit Patan (the 'City of Beauty') and finish the day watching the sunset from the UNESCO World Heritage site Swayambhunath Temple ('Monkey Temple').", image: 'https://static.wixstatic.com/media/04bfd5_52d0556642a540dd836573a367d11ff9~mv2.jpeg' },
            { day: '04', title: 'Flight to Chitwan', desc: "Fly to Meghauli (Chitwan). Meet the Nepal Tiger Trust team for a jungle walk introduction. This is the start of our immersion into one of Asia's most famous wildlife conservation areas.", image: 'https://static.wixstatic.com/media/04bfd5_65781b4315874d299cd8f3ee105766cd~mv2.jpeg' },
            { day: '05', title: 'Tiger Monitoring & Footprints', desc: "Setting camera traps and tracking tiger and leopard paws in prime habitat with the Tiger Trust team. Learn about the behavior of these magnificent big cats while documenting vital information for the trust's conservation efforts.", image: 'https://static.wixstatic.com/media/nsplsh_bf1f244dbd3445228be8c8b9197bf225~mv2.jpg' },
            { day: '06', title: 'Jeep Safari & Gharials', desc: "Full day game drive searching for rhinos, tigers, and sloth bears. Visit the Gharial Conservation breeding project to see how this endangered crocodile species is being brought back from the brink of extinction.", image: 'https://images.unsplash.com/photo-1571217684618-2e06d91599a8?q=80&w=800' },
            { day: '07', title: 'Advanced Monitoring', desc: "Continuation of fieldwork with the Tiger Trust naturalists. Engage in community forest logging and species identification, contributing directly to the database that helps protect the park's biodiversity.", image: 'https://static.wixstatic.com/media/nsplsh_10f13d8ff2664111a66cb19530a54fde~mv2.jpg' },
            { day: '08', title: 'Community Impact Project', desc: "Hands-on project based on current local needs, which could include village clean-up programmes, making eco-bricks out of plastic bottles, or supporting reforestation efforts in the buffer zone.", image: 'https://static.wixstatic.com/media/nsplsh_f21467ac195f4b02b83fb682b1d2d9d3~mv2.jpg' },
            { day: '09', title: 'Himalayan Foothills (Dhampus)', desc: "Scenic drive away from the lowlands toward the picturesque Gurung village of Dhampus. Enjoy breathtaking views of the Annapurna Massif as the mountain air begins to crisp.", image: 'https://images.unsplash.com/photo-1533130061792-649d4444984f?q=80&w=800' },
            { day: '10', title: 'Astam Eco-Village Hike', desc: "A 3-hour downhill walk through terraced fields and traditional villages to Astam. Stay in a sustainable eco-village that offers incredible panoramic views of the high Himalayas.", image: 'https://static.wixstatic.com/media/nsplsh_16fadd6d9cb74a869e1fd27101f52c20~mv2.jpg' },
            { day: '11', title: 'Pokhara Lakeside', desc: "Descend to the lakeside city of Pokhara. Visit the Jangchub Choeling Tibetan Monastery and engage with local women's development projects supporting traditional crafts.", image: 'https://static.wixstatic.com/media/nsplsh_91432e10dbce4cacb7b5ceb218071067~mv2.jpg' },
            { day: '12', title: 'Sarangkot Sunrise', desc: "Dawn views over the Annapurna range from Sarangkot, followed by yoga and a peaceful walk to the Peace Pagoda (Shanti Stupa) overlooking Lake Phewa.", image: 'https://static.wixstatic.com/media/nsplsh_eea70d89ae474a218b56b2fb6a99f987~mv2.jpg' },
            { day: '13', title: 'Return to Kathmandu (Boudhanath)', desc: "Fly back to Kathmandu. Visit Pashupatinath and the great white dome of the Boudhanath Stupa, a sacred pilgrimage site for Tibetan Buddhists.", image: 'https://static.wixstatic.com/media/nsplsh_f0aca3f3bbf144bda1bffd4ba23deb67~mv2.jpg' },
            { day: '14', title: 'Departure or Bhutan Add-on', desc: "Farewell breakfast and airport transfers, or begin your onward journey to the Kingdom of Bhutan for the optional trek extension.", image: 'https://static.wixstatic.com/media/nsplsh_0e162ca840524c7fa87a53d807751c22~mv2.jpg' }
        ],
        inclusions: [
            "Internal flights (Kathmandu-Chitwan, Pokhara-Kathmandu)",
            "Nepal Tiger Trust monitoring permit",
            "Safari jeeps and naturalist guides",
            "UNESCO site entrance fees",
            "Community project materials",
            "Yoga class in Pokhara"
        ],
        exclusions: [
            "International flights",
            "Everest scenic flight (Optional add-on)",
            "Nepal entry visa",
            "Personal travel insurance"
        ],
        highlights: [
            "Track Wild Tigers with Naturalists",
            "Annapurna Sunrise at Sarangkot",
            "Gharial Crocodile Conservation",
            "Himalayan Eco-Village Stay",
            "Tibetan Monastery Interaction"
        ],
        dates: [
            { start: "25 Apr", end: "08 May", year: 2026, bookingLink: "https://inspired.wetravel.com/checkout_embed?uuid=7429751170&source=direct_link", availability: "Open" },
            { start: "14 Nov", end: "27 Nov", year: 2026, bookingLink: "https://inspired.wetravel.com/checkout_embed?uuid=5915284910&source=direct_link", availability: "Open" }
        ]
    },
    'tanzania': {
        mission: "Safari through the Serengeti and Ngorongoro Crater, and build sustainable chicken coops for kinship-care families in Moshi.",
        whyJoin: [
            "Arrival in Moshi with views of Mount Kilimanjaro and a warm local welcome.",
            "Cultural immersion in Mkuu Village: cooking with Chagga women and Swahili lessons.",
            "Two-day Chicken Coop community project supporting kinship-care families.",
            "Classic safari circuit through Tarangire, Ngorongoro Crater, and Serengeti."
        ],
        givingBack: "This trip combines cultural immersion with hands-on environmental conservation and community development. From planting indigenous tree seedlings at the base of Kilimanjaro to building coops for kinship families, your impact is direct and lasting.",
        itinerary: [
            { day: '01', title: 'Arrival in Tanzania', desc: "Arrive at Kilimanjaro International Airport and transfer to Shanty Town in Moshi. Settle into the Panama Garden Resort and enjoy stunning views of the mountain. Gather for a welcome dinner featuring local Tanzanian flavours.", image: 'https://images.unsplash.com/photo-1523365280197-f1783db9fe62?q=80&w=800' },
            { day: '02', title: 'Immersion in Mkuu Village', desc: "A full day of cultural immersion. Shared activities include cooking with Chagga tribal women, learning traditional songs, and picking up basic Swahili. This is a chance to engage deeply with Tanzanian daily life.", image: 'https://static.wixstatic.com/media/06d336_f991ee242fe9457abc75957db1d47cff~mv2.png' },
            { day: '03', title: 'Materuni Coffee & Conservation', desc: "Learn the traditional coffee production process in Materuni Village. Try your hand at being a 'local barista' before heading to a conservation area to plant indigenous seeds at the base of Kilimanjaro.", image: 'https://static.wixstatic.com/media/06d336_fea902aa38ee44faa8fa5a5f8892f5d6~mv2.jpg' },
            { day: '04', title: 'Environmental Conservation Volunteering', desc: "Spend a full day in the tree nursery production section, preparing soil beds and caring for young seedlings. This immersive work directly contributes to long-term reforestation efforts to restore the local ecosystem.", image: 'https://static.wixstatic.com/media/0c1e44_09344d5bf09249d8949b4c32902bc60a~mv2.jpg' },
            { day: '05-06', title: 'Chicken Coop Project', desc: "Partner with Bright Future Foundation to build sustainable chicken coops for kinship-care families. These families provide stable homes for disadvantaged children, and the coops offer a source of long-term food security and income.", image: 'https://static.wixstatic.com/media/0c1e44_2b6bd8d819dd405ab70e55034f140de0~mv2.jpg' },
            { day: '07', title: 'Arusha Walking Safari', desc: "A unique walking safari in Arusha National Park. Hike into the Meru crater with an armed ranger to see Momela Lake flamingos and giraffe from a perspective few tourists ever experience.", image: 'https://static.wixstatic.com/media/0c1e44_495d1cf3ada54ae9bda2ad29ff8144d8~mv2.jpg' },
            { day: '08', title: 'Tarangire Elephants', desc: "Start the 5-day safari circuit. Tarangire is famous for its ancient baobab trees and massive elephant herds that congregate around the river. Stay in comfortable safari lodges under the stars.", image: 'https://static.wixstatic.com/media/0c1e44_4ace85639fbf4bc4add08bf2e38d52ba~mv2.jpg' },
            { day: '09', title: 'Lake Manyara Primates', desc: "Search for tree-climbing lions and blue monkeys in the lush groundwater forests of Lake Manyara National Park. The alkaline lake is often pink with thousands of lesser flamingos.", image: 'https://static.wixstatic.com/media/0c1e44_7d2615738ce54badad75d6e453209227~mv2.jpg' },
            { day: '10', title: 'Ngorongoro Crater', desc: "Descend 600m into the 'Garden of Eden'. This natural caldera is home to almost every species of plains wildlife in East Africa, including the rare black rhino and dense populations of lion and hyena.", image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800' },
            { day: '11-12', title: 'Serengeti Migration', desc: "Two nights in the world-famous Serengeti. Witness the Great Migration (seasonal) and explore the endless plains searching for cheetahs and leopards. Dine in tented camps for the ultimate safari experience.", image: 'https://static.wixstatic.com/media/0c1e44_986f0d6e36164f93809a3a0fd87cbe42~mv2.jpg' },
            { day: '13', title: 'Rest Day in Moshi', desc: "Return to Moshi for a rest day. Relax by the pool, browse local markets for souvenirs, and join the group for a celebratory farewell dinner with our drivers and hosts.", image: 'https://static.wixstatic.com/media/0c1e44_9ce8dac52aac4d39976d052797c82372~mv2.jpg' },
            { day: '14', title: 'Departure or Zanzibar', desc: "Airport transfers for international flights, or start the optional coastal extension to the spice island of Zanzibar for some post-safari relaxation by the Indian Ocean.", image: 'https://static.wixstatic.com/media/0c1e44_ec9cdf2ceb354a65973321f5a90d75a2~mv2.jpg' }
        ],
        inclusions: [
            "5-day high-end safari circuit",
            "All park and caldera entrance fees",
            "Private 4x4 land cruisers",
            "Chicken Coop project materials & donation",
            "Indigenous tree nursery contribution",
            "Chagga village cultural experiences"
        ],
        exclusions: [
            "International flights",
            "Zanzibar extension (Optional)",
            "Tips for drivers/guides",
            "Personal cocktails/laundry"
        ],
        highlights: [
            "5-Day Serengeti & Ngorongoro Safari",
            "Sustainable Chicken Coop Mission",
            "Mount Kilimanjaro Base Conservation",
            "Walking Safari with Rangers",
            "Serengeti Tented Camp Experience"
        ],
        dates: [
            { start: "08 Nov", end: "21 Nov", year: 2026, bookingLink: "https://inspired.wetravel.com/checkout_embed?uuid=23494731&source=direct_link", availability: "Open" }
        ]
    },
    'morocco': {
        mission: "Dive into the soul of Morocco with this 12-day journey, blending meaningful volunteer experiences with vibrant cultural immersion and authentic Moroccan hospitality.",
        whyJoin: [
            "Give-back volunteering: Join impactful projects in the town of Imlil to rebuild after the earthquake.",
            "Cultural Discovery: Wander Marrakech’s iconic souks and revel in the beauty of Majorelle Gardens.",
            "Desert Glamping: Spend a magical night in luxury tents under the Agafay Desert sky.",
            "Historical Sites: Visit UNESCO World Heritage sites including Fes and Hassan II Mosque."
        ],
        givingBack: "This trip embodies community-focused tourism. By listening to local needs and collaborating on sustainable projects like painting schools and water irrigation repairs, the trip ensures tourism benefits the people rather than exploiting them.",
        itinerary: [
            { day: '01', title: 'Arrival in Marrakech', desc: "Arrive at Marrakech Menara Airport and transfer to your beautiful riad in the heart of the medina. In the evening, join the group for a special welcome dinner on a rooftop overlooking the city.", image: 'https://static.wixstatic.com/media/06d336_18c89af5a0414377a5b05fdad317c043~mv2.jpg' },
            { day: '02', title: 'Historic Marrakech', desc: "Full-day guided tour of Marrakech’s rich historical sites, including Koutoubia Minaret, the Saadian Tombs, and the Bahia Palace. Stroll through the lush Majorelle Gardens and visit the YSL museum.", image: 'https://static.wixstatic.com/media/06d336_403e928ec60642e3b3c39d5fa68ab3ad~mv2.jpg' },
            { day: '03', title: 'Volunteering in Imlil', desc: "Travel to the picturesque village of Imlil in the High Atlas Mountains. Work alongside locals to paint a school that was rebuilt after the 2023 earthquake, allowing children to return to their education.", image: 'https://static.wixstatic.com/media/06d336_7168930f387a48f3a28724ba3577caac~mv2.jpg' },
            { day: '04', title: 'Road & Water Repairs', desc: "Get hands-on with essential water irrigation repairs and path clearing in Imlil. Side-by-side with village members, hear stories of mountain life while making a meaningful impact on their infrastructure.", image: 'https://images.unsplash.com/photo-1534234828563-025977935b6b?q=80&w=800' },
            { day: '05', title: 'Environmental Stewardship', desc: "Participate in a rubbish collection initiative aimed at protecting the mountain's beauty and the health of its residents while taking in the breathtaking views of the Atlas peaks.", image: 'https://static.wixstatic.com/media/06d336_c83c310ab922464b92531c545764c65e~mv2.jpg' },
            { day: '06', title: 'Berber Cooking Mastery', desc: "Immerse yourself in Moroccan culinary traditions by spending the day with a local Berber family, learning to prep authentic tagines and experiencing traditional mountain hospitality.", image: 'https://static.wixstatic.com/media/06d336_f991ee242fe9457abc75957db1d47cff~mv2.png' },
            { day: '07', title: 'Agafay Desert Night', desc: "Transfer to the rocky Agafay Desert for a sunset camel trek or quad ride. Enjoy a Bedouin-style celebration and a night of glamping in luxury tents under the Sahara stars.", image: 'https://images.unsplash.com/photo-1520529888914-72210e7163f4?q=80&w=800' },
            { day: '08', title: 'Essaouira Coastal Charm', desc: "Travel to the 'Blue City' of Essaouira. Explore the port fortress, medina markets, and enjoy the serene Atlantic atmosphere. This coastal escape is the perfect contrast to the desert heat.", image: 'https://static.wixstatic.com/media/11062b_2381e8a6e7444f4f902e7b649aa3f0ac~mv2.png' },
            { day: '09-10', title: 'English Street Class Mission', desc: "Return to community projects, providing educational support and English language practice for local adults and children through interactive 'Street Classes' and environmental workshops.", image: 'https://static.wixstatic.com/media/11062b_55e4be1e75564866b6c28290f9a9d271~mv2.png' },
            { day: '11', title: 'Hassan II Mosque & Casablanca', desc: "Travel to Casablanca to visit the stunning Hassan II Mosque, home to the world's largest minaret. Final night in the modern capital to reflect on the 12-day journey.", image: 'https://static.wixstatic.com/media/nsplsh_246fc9874dc64bbb891f75a20b5016a9~mv2.jpg' },
            { day: '12', title: 'Farewell or North Extension', desc: "Farewell breakfast and airport transfers, or begin the optional 5-day Imperial North extension to the historic cities of Fes and Chefchaouen.", image: 'https://static.wixstatic.com/media/nsplsh_53ce483282c548af8904fe949aa949fc~mv2.jpg' }
        ],
        inclusions: [
            "Earthquake restoration materials",
            "Atlas Mountain riad stays",
            "Agafay desert camp experience",
            "Hassan II Mosque guided visit",
            "Berber cooking class ingredients",
            "Private transport and local fixer"
        ],
        exclusions: [
            "International flights",
            "North Expansion add-on (Optional)",
            "Personal massages/spa",
            "Morocco entry visa (if required)"
        ],
        highlights: [
            "High Atlas Earthquake Restoration",
            "Agafay Desert Star-Gazing Camp",
            "Cook with a local Berber Family",
            "English Street Class Volunteering",
            "YSL Majorelle Gardens Visit"
        ],
        dates: [
            { start: "14 Mar", end: "25 Mar", year: 2026, availability: "Open" },
            { start: "10 Oct", end: "21 Oct", year: 2026, availability: "Open" },
            { start: "13 Mar", end: "24 Mar", year: 2027, availability: "Open" }
        ]
    }
};
