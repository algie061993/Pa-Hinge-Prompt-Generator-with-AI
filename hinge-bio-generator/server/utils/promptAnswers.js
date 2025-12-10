const PROMPT_ANSWERS = {
  "This year, I really want to": {
    funny: ["Master {i1} or at least stop being terrible at it - I've been saying this for years but maybe this is my year", "Convince myself I'm funny enough to quit my day job and do stand-up (spoiler: I'm definitely not but a person can dream)", "Actually get good at {i1} instead of just pretending I know what I'm doing when people ask"],
    romantic: ["Find someone to explore every corner of {city} with and create memories that actually matter", "Meet someone who makes me want to be the best version of myself without ever making me feel like I need to change", "Build something real with someone who gets excited about {i2} the way I do"],
    adventurous: ["Actually book that {i2} trip I keep talking about instead of just adding it to my bucket list", "Try every {i1} spot in {city} before the year ends and document the whole journey", "Stop saying maybe next year and just do all the things I've been putting off"],
    quirky: ["Turn my weird {i1} obsession into something people actually care about instead of just confusing them", "Finally embrace being the {i1} person everyone knows and stop apologizing for my interests", "Create something uniquely weird with {i2} that makes people question my sanity in the best way"],
    serious: ["Build a meaningful career around {i1} that creates lasting impact", "Create lasting change through {i2} and actually make a difference", "Achieve mastery in {i1} through dedicated practice and intentional growth"],
    intellectual: ["Deep dive into the theory behind {i1} and understand it at a fundamental level", "Master the complexities of {i2} and contribute original thinking to the field", "Explore the philosophical implications of {i1} and how it shapes our understanding"],
    default: ["Get really good at {i1} and turn it into something I'm genuinely proud of", "Turn my {i1} obsession into something real instead of just a hobby"]
  },
  "My greatest strength": {
    funny: ["Making awkward situations somehow even more awkward but at least we're all laughing about it", "Finding the humor when everything goes wrong because what else are you gonna do", "Turning uncomfortable moments into stories we'll laugh about later"],
    romantic: ["Making people feel genuinely heard and understood without them having to explain themselves", "Being completely present in the moment instead of thinking about what to say next", "Remembering the little things that matter to you even when you think nobody's paying attention"],
    adventurous: ["Turning random ideas into actual adventures instead of just talking about them", "Always being down to try something new even when it's slightly terrifying", "Convincing people to step outside their comfort zone and actually enjoy it"],
    quirky: ["Seeing connections between things that others miss completely", "Thinking outside every possible box and then questioning why the box exists", "Finding patterns in chaos that somehow make perfect sense to me"],
    serious: ["Staying composed under pressure when everyone else is losing it", "Making difficult decisions with clarity and standing by them", "Maintaining focus on what actually matters when everything feels urgent"],
    intellectual: ["Analyzing complex problems systematically and breaking them down into manageable pieces", "Connecting abstract concepts in ways that create new understanding", "Asking the questions nobody else thinks to ask about {i1}"],
    default: ["Staying calm when things don't go as planned and finding solutions instead of panicking", "Actually listening to understand instead of just waiting for my turn to talk"]
  },
  "I go crazy for": {
    funny: ["Really good {i1} and people who actually get why it matters instead of just nodding politely", "Finding the perfect {i2} spot in {city} before everyone discovers it and ruins it", "When {i1} hits exactly right and everything else just fades into the background"],
    romantic: ["Deep conversations about {i1} that last for hours and make you lose track of time", "When someone shares my genuine passion for {i2} without me having to convince them", "Those moments of connection over {i1} that feel rare and special"],
    adventurous: ["Spontaneous {i1} adventures that weren't even on the plan", "Discovering hidden {i2} spots in {city} that tourists don't know about", "That rush of trying something new with {i1} for the first time"],
    quirky: ["Obscure {i1} facts that nobody else cares about but I find fascinating", "The weird side of {i2} culture that most people don't even know exists", "Finding someone who appreciates my random {i1} knowledge"],
    serious: ["Excellence in {i1} and the dedication it takes to achieve it", "Meaningful progress in {i2} that creates lasting impact", "The pursuit of mastery in {i1} regardless of how long it takes"],
    intellectual: ["The philosophy behind {i1} and why it works the way it does", "Complex theories about {i2} that challenge conventional thinking", "Deep analysis of {i1} that most people never consider"],
    default: ["Really good {i1} that's done right", "Perfect {i2} spots in {city} with the right vibe"]
  },
  "Typical Sunday": {
    funny: ["Morning {i1}, afternoon {i2}, evening pretending I'll be productive tomorrow", "Sleeping in way too late then feeling guilty about wasting the entire day", "Whatever feels right in the moment - probably {i1} until I'm tired then {i2} until I'm hungry"],
    romantic: ["Quality time with someone special doing {i1} and actually being present", "Slow morning with {i2} and conversations that make you lose track of time", "Creating memories over {i1} instead of just scrolling through other people's"],
    adventurous: ["Exploring new {i1} spots in {city} that I've been meaning to check out", "Finding hidden gems in {city} that nobody knows about yet", "{i1} until I'm tired, {i2} until I'm hungry, then repeat the whole cycle"],
    quirky: ["Whatever weird {i1} project I'm currently obsessed with", "Deep diving into random {i2} rabbit holes that lead to more rabbit holes", "Doing {i1} things that would confuse most people but make perfect sense to me"],
    serious: ["Structured {i1} practice in the morning and {i2} planning for the week", "Productive morning focused on {i1}, reflective evening thinking about growth", "Intentional time with {i1} and meaningful progress on {i2}"],
    intellectual: ["Reading about {i1} in the morning, discussing {i2} theory in the afternoon", "Learning something new about {i1} and connecting it to what I already know", "Deep diving into {i1} concepts and exploring their implications"],
    default: ["Morning {i1}, afternoon {i2}, evening doing absolutely nothing productive", "Whatever feels right in the moment without any schedule or expectations"]
  },
  "My simple pleasures": {
    funny: ["Perfect {i1} weather when I actually have time to enjoy it", "When plans get cancelled and I can do {i2} guilt-free"],
    romantic: ["Meaningful conversations over {i1}", "Sharing {i2} with someone who gets it"],
    adventurous: ["Discovering a new {i1} spot", "Spontaneous {i2} adventures"],
    quirky: ["Finding weird {i1} connections", "Obscure {i2} references that land"],
    serious: ["Achieving progress in {i1}", "Quiet moments of {i2} reflection"],
    intellectual: ["Learning something new about {i1}", "Solving complex {i2} problems"],
    default: ["When someone texts back with matching energy", "Really good {i1} when I need it most"]
  },
  "My most irrational fear": {
    funny: ["Being the first person to text after a good date", "Saying you too when it doesn't make sense"],
    romantic: ["Vulnerability not being reciprocated", "Missing the right person"],
    adventurous: ["Regretting the adventures I didn't take", "Playing it too safe"],
    quirky: ["Being too weird for someone", "My interests being judged"],
    serious: ["Not living up to my potential", "Wasting time on wrong priorities"],
    intellectual: ["Being intellectually stagnant", "Missing important insights"],
    default: ["Ordering something new and immediately regretting it", "Small talk with people I barely know"]
  },
  "I recently discovered that": {
    funny: ["Most of my confidence is just really good acting", "I'm way more introverted than people think"],
    romantic: ["I'm ready for something real", "Connection matters more than perfection"],
    adventurous: ["I'm braver than I thought", "Comfort zones are overrated"],
    quirky: ["My weird interests are actually my best feature", "Normal is boring anyway"],
    serious: ["Self-awareness is ongoing work", "Growth requires discomfort"],
    intellectual: ["I learn best through {i1}", "Curiosity drives everything I do"],
    default: ["I have strong opinions about things that don't matter", "I need alone time more than I admit"]
  },
  "A life goal of mine": {
    funny: ["Not embarrass myself in public (failing so far)", "Master {i1} before I'm too old to care"],
    romantic: ["Find a love story worth telling", "Build something meaningful with someone special"],
    adventurous: ["Visit every place on my bucket list", "Turn {i1} into my lifestyle"],
    quirky: ["Create something uniquely weird with {i1}", "Be known for my {i2} obsession"],
    serious: ["Make lasting impact through {i1}", "Achieve mastery in {i2}"],
    intellectual: ["Contribute original thought to {i1}", "Understand {i2} at the deepest level"],
    default: ["Master {i1} completely", "Build something I'm genuinely proud of"]
  },
  "Dating me is like": {
    funny: ["Getting a personal comedian (results may vary)", "Spontaneous {i1} adventures you didn't plan for"],
    romantic: ["Always having someone who actually listens", "Finding your adventure partner in {city}"],
    adventurous: ["Never having a boring weekend", "Always trying new {i1} experiences"],
    quirky: ["Embracing the weird side of {i1}", "Deep conversations about random {i2}"],
    serious: ["Building something meaningful together", "Having a genuine partner in growth"],
    intellectual: ["Endless discussions about {i1}", "Exploring ideas together"],
    default: ["Matched enthusiasm about {i2}", "Never running out of things to talk about"]
  },
  "The way to win me over is": {
    funny: ["Out-joke me, I dare you (you probably can't)", "Make me laugh at something completely stupid"],
    romantic: ["Plan something thoughtful that shows you listen", "Remember random things I mention weeks later"],
    adventurous: ["Suggest a spontaneous {i1} adventure", "Be down to try new {i2} experiences"],
    quirky: ["Appreciate my weird {i1} interests", "Match my random {i2} energy"],
    serious: ["Show genuine depth and intention", "Demonstrate consistent effort"],
    intellectual: ["Challenge my thinking about {i1}", "Teach me something new about {i2}"],
    default: ["Show me a {i2} spot in {city} I don't know", "Be passionate about something like I am about {i1}"]
  },
  "My Love Language is": {
    funny: ["Acts of service but make it {i1} runs when I'm too lazy to go myself", "Quality time without phones because the bar is literally on the floor at this point", "Words of affirmation but only when they're not cringe and actually mean something"],
    romantic: ["Quality time where we're actually present and not just physically in the same room", "Genuine words of affirmation that feel real and not like you're reading from a script", "Thoughtful surprises that show you actually listen to the random things I mention"],
    adventurous: ["Shared adventures and new experiences that we can look back on", "Spontaneous acts of {i1} together without overthinking it", "Creating memories through {i2} instead of just talking about doing it someday"],
    quirky: ["Understanding my weird {i1} references without me having to explain them", "Embracing random {i2} moments and going with whatever weird direction they take", "Appreciating my niche {i1} interests instead of just tolerating them"],
    serious: ["Consistent presence and reliability when it matters most", "Actions that actually match your words instead of empty promises", "Showing up with intention and following through on commitments"],
    intellectual: ["Deep conversations about {i1} that challenge my thinking", "Sharing knowledge about {i2} and learning from each other", "Intellectual connection through discussing {i1} ideas"],
    default: ["Little acts of service that show you're thinking about me", "Quality time without distractions where we're actually engaged"]
  },
  "The dorkiest thing about me is": {
    funny: ["I have playlists for literally every possible mood", "Strong opinions about the correct way to load a dishwasher"],
    romantic: ["I remember every detail you tell me", "I plan future dates in my head"],
    adventurous: ["I research {i1} spots obsessively", "I have a bucket list for {i2}"],
    quirky: ["My entire {i1} collection", "I categorize everything about {i2}"],
    serious: ["I journal about {i1} progress", "I track my {i2} development"],
    intellectual: ["I read academic papers about {i1} for fun", "I debate {i2} theory with myself"],
    default: ["I get way too invested in fictional characters", "I geek out about {i1} way too much"]
  },
  "We're the same type of weird if": {
    funny: ["You cancel plans guilt-free and feel absolutely zero regret about it", "You have strong opinions about things that don't matter at all", "You get unreasonably excited about niche {i1} interests that confuse most people"],
    romantic: ["You believe in deep connection over surface level small talk", "You value quality time over expensive dates or grand gestures", "You think vulnerability is strength and not something to hide"],
    adventurous: ["You say yes first and figure out the details later", "You're always down for spontaneous {i1} adventures", "You think comfort zones are meant to be challenged regularly"],
    quirky: ["Your interests confuse most people but make perfect sense to you", "You have weird {i1} obsessions that you're not apologizing for", "You find connections between random things that nobody else sees"],
    serious: ["You prioritize growth over comfort every single time", "You value substance over style in everything", "You believe actions speak louder than any words ever could"],
    intellectual: ["You love discussing {i1} theory just for the sake of understanding", "You question everything about {i2} instead of accepting it at face value", "You think deep conversations are better than small talk any day"],
    default: ["Your ideal weekend sounds boring to most people but perfect to you", "You get excited about stuff others find weird and you're okay with that"]
  },
  "I want someone who": {
    funny: ["Laughs at my jokes (even the bad ones)", "Doesn't take life too seriously"],
    romantic: ["Makes me want to be better without changing who I am", "Chooses me every day"],
    adventurous: ["Wants to explore every corner of {city} with me", "Turns random ideas into actual plans"],
    quirky: ["Appreciates my weird {i1} side", "Gets excited about random {i2}"],
    serious: ["Has clear goals and values", "Communicates with intention"],
    intellectual: ["Challenges my thinking", "Loves learning about {i1}"],
    default: ["Is passionate about their own thing", "Gets excited about {i2}"]
  },
  "I know the best spot in town for": {
    funny: ["{i1} that'll make you question your life choices", "Late night {i2} when you're making bad decisions"],
    romantic: ["Underrated sunset spots in {city}", "Hidden romantic places tourists don't know"],
    adventurous: ["Adventures around {city} most people skip", "Hidden {i1} places tourists don't know"],
    quirky: ["Weird {i1} experiences", "Obscure {i2} spots nobody knows"],
    serious: ["Professional {i1} venues", "Quality {i2} establishments"],
    intellectual: ["{i1} with great atmosphere for deep talks", "Quiet {i2} spots perfect for reading"],
    default: ["{i1} in {city} - I've tried them all", "Late night {i2} spots"]
  },
  "Together, we could": {
    funny: ["Make terrible decisions and great memories", "Turn {i1} into our thing"],
    romantic: ["Create memories worth keeping", "Build something actually meaningful"],
    adventurous: ["Explore every corner of {city}", "Turn random ideas into actual adventures"],
    quirky: ["Start a weird {i1} collection", "Create something uniquely ours with {i2}"],
    serious: ["Build something lasting", "Achieve meaningful goals together"],
    intellectual: ["Explore complex ideas about {i1}", "Learn everything about {i2}"],
    default: ["Find the best {i2} in {city}", "Make every weekend an adventure"]
  },
  "Green flags I look out for": {
    funny: ["They laugh at themselves", "They don't take everything seriously"],
    romantic: ["They remember what matters to me", "They show up with actions not just words"],
    adventurous: ["They're spontaneous", "They try new things eagerly"],
    quirky: ["They embrace weird", "They have unique interests"],
    serious: ["Consistent communication", "Clear intentions"],
    intellectual: ["Intellectual curiosity", "Thoughtful perspectives"],
    default: ["Genuine passion for something", "Matching energy without trying"]
  },
  "I'm looking for": {
    funny: ["Someone who gets my humor", "A partner in crime for {i1} adventures"],
    romantic: ["Someone ready for something real", "A partner who gets excited about {i2}"],
    adventurous: ["Someone who explores {city} with me", "Someone down for spontaneous {i2} adventures"],
    quirky: ["Someone who appreciates weird {i1}", "A fellow {i2} enthusiast"],
    serious: ["Someone with clear intentions", "A genuine partner in growth"],
    intellectual: ["Someone who loves discussing {i1}", "A curious mind interested in {i2}"],
    default: ["Someone passionate about their thing", "Ready for something real"]
  },
  "First round is on me if": {
    funny: ["You show up on time (the bar is literally on the floor)", "You make me laugh in the first 5 minutes"],
    romantic: ["You're genuinely yourself", "You make me feel heard"],
    adventurous: ["You suggest something spontaneous", "You're down for an adventure"],
    quirky: ["You appreciate my weird {i1} references", "You have obscure {i2} knowledge"],
    serious: ["You show genuine interest", "You communicate clearly"],
    intellectual: ["You challenge my thinking", "You teach me something new"],
    default: ["You beat me at my favorite game", "You can keep up with my banter"]
  },
  "Let's debate this topic": {
    funny: ["Best time to text back is immediately or never", "Being busy is code for not interested"],
    romantic: ["Love languages matter more than people think", "Chemistry can't be forced"],
    adventurous: ["Spontaneity beats planning", "Comfort zones are overrated"],
    quirky: ["Weird is better than normal", "Niche interests are superior"],
    serious: ["Actions speak louder than words", "Effort should be equal"],
    intellectual: ["Why {i1} is more complex than it seems", "The philosophy behind {i2}"],
    default: ["Chemistry can't be forced", "Effort should go both ways"]
  },
  "I bet you can't": {
    funny: ["Out-joke me (you probably can't)", "Name a better late-night snack"],
    romantic: ["Make me feel more understood", "Plan a better first date"],
    adventurous: ["Find a better adventure in {city}", "Beat my {i1} record"],
    quirky: ["Match my weird {i1} knowledge", "Appreciate {i2} more than me"],
    serious: ["Challenge my perspective meaningfully", "Demonstrate more consistency"],
    intellectual: ["Teach me something new about {i1}", "Debate {i2} theory with me"],
    default: ["Find a better weekend plan", "Change my mind about {i1}"]
  }
};

module.exports = { PROMPT_ANSWERS };
