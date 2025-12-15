// Import all prompt files
const thisYearIReallyWantTo = require('./thisYearIReallyWantTo');
const myGreatestStrength = require('./myGreatestStrength');
const iGoCrazyFor = require('./iGoCrazyFor');
const typicalSunday = require('./typicalSunday');
const mySimplePleasures = require('./mySimplePleasures');
const myMostIrrationalFear = require('./myMostIrrationalFear');
const iRecentlyDiscoveredThat = require('./iRecentlyDiscoveredThat');
const aLifeGoalOfMine = require('./aLifeGoalOfMine');
const datingMeIsLike = require('./datingMeIsLike');
const theWayToWinMeOverIs = require('./theWayToWinMeOverIs');
const myLoveLanguageIs = require('./myLoveLanguageIs');
const theDorkiestThingAboutMeIs = require('./theDorkiestThingAboutMeIs');
const wereTheSameTypeOfWeirdIf = require('./wereTheSameTypeOfWeirdIf');
const iWantSomeoneWho = require('./iWantSomeoneWho');
const iKnowTheBestSpotInTownFor = require('./iKnowTheBestSpotInTownFor');
const togetherWeCould = require('./togetherWeCould');
const greenFlagsILookOutFor = require('./greenFlagsILookOutFor');
const imLookingFor = require('./imLookingFor');
const firstRoundIsOnMeIf = require('./firstRoundIsOnMeIf');
const letsDebateThisTopic = require('./letsDebateThisTopic');
const iBetYouCant = require('./iBetYouCant');
const changeMyMindAbout = require('./changeMyMindAbout');
const giveMeTravelTipsFor = require('./giveMeTravelTipsFor');
const teachMeSomethingAbout = require('./teachMeSomethingAbout');
const tryToGuessThisAboutMe = require('./tryToGuessThisAboutMe');
const youShouldLeaveACommentIf = require('./youShouldLeaveACommentIf');
const illPickTheTopicIfYouStartTheConversation = require('./illPickTheTopicIfYouStartTheConversation');
const theOneThingIdLoveToKnowAboutYouIs = require('./theOneThingIdLoveToKnowAboutYouIs');
const letsMakeSureWereOnTheSamePageAbout = require('./letsMakeSureWereOnTheSamePageAbout');
const doYouAgreeOrDisagreeThat = require('./doYouAgreeOrDisagreeThat');
const illBragAboutYouToMyFriendsIf = require('./illBragAboutYouToMyFriendsIf');
const theHallmarkOfAGoodRelationshipIs = require('./theHallmarkOfAGoodRelationshipIs');
const imWeirdlyAttractedTo = require('./imWeirdlyAttractedTo');
const myLastJournalEntryWasAbout = require('./myLastJournalEntryWasAbout');
const myCryinthecarSongIs = require('./myCryinthecarSongIs');
const aBoundaryOfMineIs = require('./aBoundaryOfMineIs');
const iUnwindBy = require('./iUnwindBy');
const mySelfcareRoutineIs = require('./mySelfcareRoutineIs');
const iBeatMyBluesBy = require('./iBeatMyBluesBy');
const whenINeedAdviceIGoTo = require('./whenINeedAdviceIGoTo');
const myTherapistWouldSayI = require('./myTherapistWouldSayI');
const theLastTimeICriedHappyTearsWas = require('./theLastTimeICriedHappyTearsWas');
const theKeyToMyHeartIs = require('./theKeyToMyHeartIs');
const iWontShutUpAbout = require('./iWontShutUpAbout');
const iGeekOutOn = require('./iGeekOutOn');
const whatIOrderForTheTable = require('./whatIOrderForTheTable');
const myFriendsAskMeForAdviceAbout = require('./myFriendsAskMeForAdviceAbout');
const therapyRecentlyTaughtMe = require('./therapyRecentlyTaughtMe');
const iFeelMostSupportedWhen = require('./iFeelMostSupportedWhen');
const wellGetAlongIf = require('./wellGetAlongIf');
const somethingThatsNonNegotiableForMeIs = require('./somethingThatsNonNegotiableForMeIs');
const allIAskIsThatYou = require('./allIAskIsThatYou');
const idFallForYouIf = require('./idFallForYouIf');

// Master prompt answers object
const PROMPT_ANSWERS = {
  "This year, I really want to": thisYearIReallyWantTo,
  "My greatest strength": myGreatestStrength,
  "I go crazy for": iGoCrazyFor,
  "Typical Sunday": typicalSunday,
  "My simple pleasures": mySimplePleasures,
  "My most irrational fear": myMostIrrationalFear,
  "I recently discovered that": iRecentlyDiscoveredThat,
  "A life goal of mine": aLifeGoalOfMine,
  "Dating me is like": datingMeIsLike,
  "The way to win me over is": theWayToWinMeOverIs,
  "My Love Language is": myLoveLanguageIs,
  "The dorkiest thing about me is": theDorkiestThingAboutMeIs,
  "We're the same type of weird if": wereTheSameTypeOfWeirdIf,
  "I want someone who": iWantSomeoneWho,
  "I know the best spot in town for": iKnowTheBestSpotInTownFor,
  "Together, we could": togetherWeCould,
  "Green flags I look out for": greenFlagsILookOutFor,
  "I'm looking for": imLookingFor,
  "First round is on me if": firstRoundIsOnMeIf,
  "Let's debate this topic": letsDebateThisTopic,
  "I bet you can't": iBetYouCant,
  "Change my mind about": changeMyMindAbout,
  "Give me travel tips for": giveMeTravelTipsFor,
  "Teach me something about": teachMeSomethingAbout,
  "Try to guess this about me": tryToGuessThisAboutMe,
  "You should leave a comment if": youShouldLeaveACommentIf,
  "I'll pick the topic if you start the conversation": illPickTheTopicIfYouStartTheConversation,
  "The one thing I'd love to know about you is": theOneThingIdLoveToKnowAboutYouIs,
  "Let's make sure we're on the same page about": letsMakeSureWereOnTheSamePageAbout,
  "Do you agree or disagree that": doYouAgreeOrDisagreeThat,
  "I'll brag about you to my friends if": illBragAboutYouToMyFriendsIf,
  "The hallmark of a good relationship is": theHallmarkOfAGoodRelationshipIs,
  "I'm weirdly attracted to": imWeirdlyAttractedTo,
  "My last journal entry was about": myLastJournalEntryWasAbout,
  "My cry-in-the-car song is": myCryinthecarSongIs,
  "A boundary of mine is": aBoundaryOfMineIs,
  "I unwind by": iUnwindBy,
  "My self-care routine is": mySelfcareRoutineIs,
  "I beat my blues by": iBeatMyBluesBy,
  "When I need advice, I go to": whenINeedAdviceIGoTo,
  "My therapist would say I": myTherapistWouldSayI,
  "The last time I cried happy tears was": theLastTimeICriedHappyTearsWas,
  "The key to my heart is": theKeyToMyHeartIs,
  "I won't shut up about": iWontShutUpAbout,
  "I geek out on": iGeekOutOn,
  "What I order for the table": whatIOrderForTheTable,
  "My friends ask me for advice about": myFriendsAskMeForAdviceAbout,
  "Therapy recently taught me": therapyRecentlyTaughtMe,
  "I feel most supported when": iFeelMostSupportedWhen,
  "We'll get along if": wellGetAlongIf,
  "Something that's non-negotiable for me is": somethingThatsNonNegotiableForMeIs,
  "All I ask is that you": allIAskIsThatYou,
  "I'd fall for you if": idFallForYouIf,
};

module.exports = { PROMPT_ANSWERS };