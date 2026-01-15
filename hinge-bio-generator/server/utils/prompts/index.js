// Import all prompt files
const aBoundaryOfMineIs = require('./aBoundaryOfMineIs');
const aLifeGoalOfMine = require('./aLifeGoalOfMine');
const allIAskIsThatYou = require('./allIAskIsThatYou');
const changeMyMindAbout = require('./changeMyMindAbout');
const datingMeIsLike = require('./datingMeIsLike');
const doYouAgreeOrDisagreeThat = require('./doYouAgreeOrDisagreeThat');
const firstRoundIsOnMeIf = require('./firstRoundIsOnMeIf');
const giveMeTravelTipsFor = require('./giveMeTravelTipsFor');
const greenFlagsILookOutFor = require('./greenFlagsILookOutFor');
const iBeatMyBluesBy = require('./iBeatMyBluesBy');
const iBetYouCant = require('./iBetYouCant');
const idFallForYouIf = require('./idFallForYouIf');
const iFeelMostSupportedWhen = require('./iFeelMostSupportedWhen');
const iGeekOutOn = require('./iGeekOutOn');
const iGoCrazyFor = require('./iGoCrazyFor');
const iKnowTheBestSpotInTownFor = require('./iKnowTheBestSpotInTownFor');
const illBragAboutYouToMyFriendsIf = require('./illBragAboutYouToMyFriendsIf');
const illPickTheTopicIfYouStartTheConversation = require('./illPickTheTopicIfYouStartTheConversation');
const imLookingFor = require('./imLookingFor');
const imWeirdlyAttractedTo = require('./imWeirdlyAttractedTo');
const iRecentlyDiscoveredThat = require('./iRecentlyDiscoveredThat');
const iUnwindBy = require('./iUnwindBy');
const iWantSomeoneWho = require('./iWantSomeoneWho');
const iWontShutUpAbout = require('./iWontShutUpAbout');
const letsDebateThisTopic = require('./letsDebateThisTopic');
const letsMakeSureWereOnTheSamePageAbout = require('./letsMakeSureWereOnTheSamePageAbout');
const myCryinthecarSongIs = require('./myCryinthecarSongIs');
const myFriendsAskMeForAdviceAbout = require('./myFriendsAskMeForAdviceAbout');
const myGreatestStrength = require('./myGreatestStrength');
const myLastJournalEntryWasAbout = require('./myLastJournalEntryWasAbout');
const myLoveLanguageIs = require('./myLoveLanguageIs');
const myMostIrrationalFear = require('./myMostIrrationalFear');
const mySelfcareRoutineIs = require('./mySelfcareRoutineIs');
const mySimplePleasures = require('./mySimplePleasures');
const myTherapistWouldSayI = require('./myTherapistWouldSayI');
const somethingThatsNonNegotiableForMeIs = require('./somethingThatsNonNegotiableForMeIs');
const teachMeSomethingAbout = require('./teachMeSomethingAbout');
const theDorkiestThingAboutMeIs = require('./theDorkiestThingAboutMeIs');
const theHallmarkOfAGoodRelationshipIs = require('./theHallmarkOfAGoodRelationshipIs');
const theKeyToMyHeartIs = require('./theKeyToMyHeartIs');
const theLastTimeICriedHappyTearsWas = require('./theLastTimeICriedHappyTearsWas');
const theOneThingIdLoveToKnowAboutYouIs = require('./theOneThingIdLoveToKnowAboutYouIs');
const therapyRecentlyTaughtMe = require('./therapyRecentlyTaughtMe');
const theWayToWinMeOverIs = require('./theWayToWinMeOverIs');
const thisYearIReallyWantTo = require('./thisYearIReallyWantTo');
const togetherWeCould = require('./togetherWeCould');
const tryToGuessThisAboutMe = require('./tryToGuessThisAboutMe');
const typicalSunday = require('./typicalSunday');
const wellGetAlongIf = require('./wellGetAlongIf');
const wereTheSameTypeOfWeirdIf = require('./wereTheSameTypeOfWeirdIf');
const whatIOrderForTheTable = require('./whatIOrderForTheTable');
const whenINeedAdviceIGoTo = require('./whenINeedAdviceIGoTo');
const youShouldLeaveACommentIf = require('./youShouldLeaveACommentIf');

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
