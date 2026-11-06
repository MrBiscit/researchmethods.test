// Problems from Liu et al. (COLM 2026), Appendix C.2 (sourced from Manhattan Review
// SAT reading practice). Each has two short texts and a four-option question.

export type OptionKey = "A" | "B" | "C" | "D";

export interface Problem {
  id: string;
  topic: string;
  text1: string;
  text2: string;
  question: string;
  options: Record<OptionKey, string>;
  correct: OptionKey;
}

export type Phase = "pretest" | "learning" | "test";

const Q_TEXT2_OVERALL =
  "Based on the texts, how would the author of Text 2 most likely respond to the overall argument presented in Text 1?";

export const PRETEST: Problem[] = [
  {
    id: "pre-1",
    topic: "Photo essays",
    text1:
      "Photo essays are increasingly popular in news outlets, but they should not be classified as journalism. By definition, journalism conveys information through language alone; photo essays communicate through images and use language only sparingly, in captions and short blurbs. Readers experience a photo essay as a sequence of pictures rather than as written reporting, which makes the form closer to gallery art than to journalism. In this view, the core of journalism is extended prose that explains events and evidence, so photo essays fall outside that category.",
    text2:
      "Photo essays present their reporting through both language and images. Without captions, sequencing notes, and short text blocks, readers would not know who is pictured, what happened, or why it matters. The account emerges from the interaction of text and image. Moreover, acclaimed photo essays in major newspapers include writing that meets the standards of careful reporting and clear style. Therefore, photo essays qualify as journalistic work.",
    question: Q_TEXT2_OVERALL,
    options: {
      A: "By arguing that journalism is not confined to prose alone and that photo essays, which use captions and short text to convey essential facts, satisfy accepted journalistic standards.",
      B: "By acknowledging that Text 1 correctly identifies a universal weakness in photo essays, namely that they lack sufficient language to report facts and therefore fail to meet journalistic standards.",
      C: "By suggesting that some photo essays are harder to follow than Text 1 admits, which complicates public reception, but leaves them better treated as a distinct visual form, not as journalism.",
      D: "By agreeing that photo essays lack rigorous reporting and writing comparable to standard articles and should therefore be regarded primarily as visual art rather than as journalism in professional contexts.",
    },
    correct: "A",
  },
];

export const LEARNING: Problem[] = [
  {
    id: "main-1",
    topic: "Esports",
    text1:
      "Esports draw huge audiences online and in arenas, but they should not be classified as sports. By definition, sport is a physical contest in which trained bodies display strength, endurance, or speed. Video game tournaments rely on software, strategy, and quick thinking, with only limited bodily exertion. They borrow the language of athletics, yet center on screen events rather than on-field performance. In this sense, esports resemble chess or music performance more than track or soccer, and they therefore fall outside the category of sport.",
    text2:
      "Supporters counter that esports present competitive events through both coordinated physical control and rapid decision making. Without precise hand and arm movements, players cannot execute tactics at all. Standardized rules, officiating, and time limits govern matches, and teams follow rigorous practice schedules that sport scientists now study in labs. Moreover, many accepted sports, such as archery and shooting, prize accuracy and composure over heavy exertion. On these grounds, esports satisfy the criteria for a sporting contest.",
    question: Q_TEXT2_OVERALL,
    options: {
      A: "By asserting that criteria beyond raw exertion help define sport more than Text 1 admits, pointing to precision events and to esports’ formal rules, training schedules, and objective competition.",
      B: "By acknowledging that Text 1 has exposed a universal flaw in esports, namely the lack of uniform rules, certified officials, and stable leagues that would justify any claim to sport.",
      C: "By suggesting that some esports possess rule systems far more complex than the author of Text 1 concedes, which means their difficulty warrants separate recognition rather than classification as sport.",
      D: "By agreeing that esports lack the rigorous physical training seen in established athletics and therefore should be considered entertainment products instead of sports within educational or professional contexts.",
    },
    correct: "A",
  },
  {
    id: "main-2",
    topic: "Maize isotopes",
    text1:
      "Anthropologist Maya Laird and colleagues measured carbon and nitrogen isotope ratios in bone collagen from burials in two river valleys. They reported δ13C and δ15N values consistent with heavy reliance on maize by about 500 CE. Laird’s team argues that these signatures support a regionwide shift to intensive maize farming and storage, broadly similar to later historical accounts. The authors contend that isotopes provide the clearest line of evidence available for diet and land use at this time, implying that communities had already adopted field systems that could sustain large settlements.",
    text2:
      "Archaeologists David Corbett and Lina Cho maintain that bulk collagen isotopes are often overinterpreted as markers of maize agriculture. Similar values can arise from marine fish consumption, arid-zone plants, or trophic-level changes in freshwater settings. They note that Laird’s study did not incorporate compound-specific amino-acid analyses, enamel carbonate data, or plant microfossils from tools and dental calculus, which could separate these possibilities. Corbett and Cho conclude that without such complementary evidence, claims about an early, regionwide maize regime likely rest on an incomplete reading of the available signals.",
    question:
      "Based on the texts, how would Corbett and Cho (Text 2) most likely characterize the conclusion presented in Text 1?",
    options: {
      A: "As unexpected, because many scholars had believed maize was absent locally at that time, so the isotope-based claim sharply overturns prevailing views.",
      B: "As premature, because researchers in this region have only recently begun using isotope methods, leaving too little baseline information for firm dietary inferences.",
      C: "As questionable, because it relies on isotope signals that could reflect several alternative sources, and it omits complementary tests needed to distinguish among them.",
      D: "As puzzling, because it is rare to recover measurable collagen isotope values from burials of that age, making any dietary reconstruction unusually uncertain.",
    },
    correct: "C",
  },
  {
    id: "main-3",
    topic: "Asteroid belt",
    text1:
      "Astronomers have long wondered how tens of thousands of asteroids can persist in the main belt between Mars and Jupiter while orbiting the same star and drawing on the same material. According to conventional wisdom, gravity-driven accretion should let a few bodies sweep up the rest. So why do so many remain as separate objects after billions of years? Despite many proposed models, researchers still have not reached a fully satisfying explanation.",
    text2:
      "Dynamical astronomer Leena Varma and colleagues connect the belt’s diversity to orbital stirring. Because these rocky bodies are small and widely spaced, they rarely meet at gentle speeds. Jupiter’s resonances continually jostle their paths, turning potential mergers into shattering impacts. In such conditions, direct growth by sticking probably happens far less than previously believed, which reduces the kind of head-to-head competition that the older picture assumed.",
    question:
      "Based on the texts, how would Varma and colleagues (Text 2) most likely respond to the “conventional wisdom” discussed in Text 1?",
    options: {
      A: "By arguing that it rests on a misconception about how often asteroids can merge with one another in the stirred belt environment.",
      B: "By asserting that it ignores the continual delivery of fresh fragments from comets that prevents competition among belt asteroids.",
      C: "By suggesting that their own findings help clarify how asteroids are able to compete directly with Jupiter’s powerful gravitational field.",
      D: "By recommending that more astronomers examine how merger rates among asteroids are increased when their typical encounter speeds become higher.",
    },
    correct: "A",
  },
  {
    id: "main-4",
    topic: "Highway lanes",
    text1:
      "For decades, transportation policy followed a simple rule. If a highway corridor was congested, add lanes and traffic would ease. Early postwar projects seemed to confirm this view, with new pavement delivering smoother flow and shorter trips. The apparent success fostered confidence that congestion falls in predictable stages as capacity increases, a belief that guided many large road programs. Yet chronic delays persisted in growing metro areas, prompting recurring debates over whether the old recipe still captures how drivers and networks actually behave.",
    text2:
      "In a recent synthesis, transportation researchers Maria Chen and Raul Ortega argue that travel adapts quickly to fresh capacity. Using sensor data, toll records, and long panel studies, they report that added lanes often attract new trips, rerouted drivers, and longer distances within a few years. Some corridors show brief relief followed by a rebound to familiar delays. The authors conclude that the relationship between capacity and congestion is not one direction, and that under common conditions the extra space restores queues rather than eliminating them.",
    question:
      "Based on the texts, how would Chen and Ortega (Text 2) most likely respond to the “conventional wisdom” discussed in Text 1?",
    options: {
      A: "By conceding that adding lanes sometimes helps, while asserting that transit and pricing are the more important long-term remedies for persistent urban congestion.",
      B: "By disputing the claim that congestion reliably declines in a step-by-step manner as capacity expands, given evidence that new lanes quickly fill with traffic.",
      C: "By acknowledging that induced demand likely was not a significant factor before smartphones and ride-hailing, which the texts suggest created large numbers of additional trips.",
      D: "By challenging the assumption that early downtown bottlenecks were the original causes of urban delay, rather than later suburban interchanges and peripheral ring roads.",
    },
    correct: "B",
  },
  {
    id: "main-5",
    topic: "Crows and ravens",
    text1:
      "Urban ecologists have long wondered how both crows and ravens can thrive in the same cities while feeding on many of the same resources. According to conventional wisdom, one species should eventually displace the other after outcompeting it for food. Yet both birds continue to expand across large metropolitan regions. Field surveys and casual observations have produced many partial explanations, but none has fully solved the puzzle of coexistence. If crows and ravens truly overlap in diet and habitat, why does one not prevail? Researchers still lack a satisfactory account that explains how closely related scavengers persist side by side in crowded urban landscapes.",
    text2:
      "Ornithologist Priya Raman and colleagues connect this coexistence to fine-scale separation in time and space. Using GPS tags, camera traps, and stable isotope analyses, they found that crows concentrate around schoolyards and parks during daylight, while ravens favor early morning loading docks and taller rooftops. The birds also differ in flight height and perch choice, which limits direct encounters at food sources. Raman’s team concludes that apparent overlap masks reduced interaction. In cities, microhabitat and daily schedule differences likely make head-to-head competition between crows and ravens much less common than previously assumed.",
    question:
      "Based on the texts, how would Raman and colleagues (Text 2) most likely respond to the “conventional wisdom” discussed in Text 1?",
    options: {
      A: "By arguing that it rests on a misconception about how often crows and ravens actually compete directly for the same urban food sources.",
      B: "By asserting that it overlooks the steady influx of human food waste that prevents competition from emerging between the two corvid species.",
      C: "By suggesting that their findings mainly clarify how crows and ravens are able to compete successfully with larger city-dwelling raptors.",
      D: "By recommending that more researchers study how competition between crows and ravens increases when artificial lighting expands nighttime activity.",
    },
    correct: "A",
  },
];

export const TEST: Problem[] = [
  {
    id: "final-1",
    topic: "Bus lanes",
    text1:
      "When cities convert mixed-traffic lanes into protected bus lanes, officials often claim that commuters will benefit through faster, more reliable trips. Transportation analyst Renee Solis tested this notion on a busy Midtown corridor by modeling schedules, signal timing, and turning movements. Her simulations, calibrated with probe-vehicle data, indicated that average door-to-door travel times for drivers and for many bus riders would rise in the first year after the conversion. The modeled delays reflected new turn restrictions, longer pedestrian phases, and spillback at intersections that blocked side streets. Solis concluded that, contrary to the stated goal, creating a bus-only facility on that corridor would likely make most commuters worse off.",
    text2:
      "Urban economists Malik Ortiz and Sora Kim argue that evaluations of street reallocations fixate on short windows and single-corridor metrics. Drawing on multiyear data from several European and Latin American cities, they show that protected bus lanes can trigger network adaptations: riders shift routes, agencies retime signals, and drivers change departure times or modes. After these adjustments, average person-throughput and trip reliability tend to improve citywide. Ortiz and Kim contend that efficiency gains materialize over several years, so near-term corridor slowdowns should not be taken as the final word on commuter welfare.",
    question:
      "Based on the texts, how would Ortiz and Kim (Text 2) most likely respond to Solis’s findings (Text 1)?",
    options: {
      A: "They would recommend that Solis compare the near-term effect on Midtown travel times with results from a different corridor in another city.",
      B: "They would argue that, over the long term, operating costs for the bus system will also rise, offsetting any efficiency gains from the lane conversion.",
      C: "They would encourage Solis to investigate whether the modeled travel-time increases persist after network adaptations over an extended period.",
      D: "They would claim that protected bus lanes have fundamentally different effects in North American cities than in the cities used in their studies.",
    },
    correct: "C",
  },
  {
    id: "final-2",
    topic: "Fine-free libraries",
    text1:
      "Public libraries that drop late fees often promise broader access, but the policy can carry costs. Analyst Marcia Levin modeled a large city system’s first-year shift to fine-free lending. Calibrating with transaction logs and staff time studies, she projected lower revenue, longer queues for popular titles, and a small rise in very overdue items. Added customer service calls and reminder notices absorbed hours once spent on programs. Levin concluded that, at least in the near term, eliminating fines would leave patrons waiting longer while the system faces tighter budgets and higher operating burdens. Her report urged caution before scaling the policy beyond a pilot.",
    text2:
      "Library researchers Damon Ruiz and Alisha Porter argue that evaluations of fine-free policies stop too soon. Using multiyear evidence from dozens of systems, they find that card renewals rise, materials are returned at higher rates after improved outreach, and circulation expands in neighborhoods with past debt blocks. Processing costs fall when staff stop handling coin boxes and appeals, and grants and small donations offset lost fees. After two to three budget cycles, per-loan costs and holds stabilize. Ruiz and Porter contend that early disruptions are real but temporary, and that long-run patron engagement and efficiency gains should guide decisions.",
    question:
      "Based on the texts, how would Ruiz and Porter (Text 2) most likely respond to Levin’s findings (Text 1)?",
    options: {
      A: "They would suggest comparing the short-term effects in Levin’s city with outcomes from another city that kept fines, to control for differences in catalog size and local demand.",
      B: "They would argue that, over time, operating costs for a fine-free system increase further, which cancels out any gains in access that patrons might experience after the policy change.",
      C: "They would encourage Levin to test whether the projected delays and budget pressures persist after two or more years of outreach, process changes, and broader patron re-engagement.",
      D: "They would claim that fine-free policies have fundamentally different effects in large urban systems than in the smaller systems that appear in their multiyear datasets.",
    },
    correct: "C",
  },
  {
    id: "final-3",
    topic: "Self-healing concrete",
    text1:
      "City bridges eventually crack from stress and weather. But researchers studying ancient Roman harbor ruins found that their concrete seems to “heal” small fractures when seawater seeps in. Recent lab work reports a similar effect in modern trial mixes that include tiny lime-rich clasts and pozzolanic ash, with microcracks closing over weeks in brine. Engineers say this parallel points to an accessible path to longer-lasting highway bridges, potentially reducing maintenance closures and costly emergency repairs.",
    text2:
      "When materials scientist Lila Moreno and her team described healing-like behavior in their modern mixes, the claim drew interest. Yet, as they emphasized, the chemistry appears to depend on slow marine interactions not typical of bridge decks, and the role of the clasts is not fully established. Moreno has compared the clasts to “seeds” that may release binding material under certain conditions, but how this would work in everyday bridge environments remains uncertain.",
    question:
      "Based on the texts, what would the author of Text 2 most likely say about Text 1’s characterization of the modern-concrete finding?",
    options: {
      A: "It is reasonable given the team has confirmed the same mechanism in both marine settings and highway bridges.",
      B: "It is overly optimistic because the mechanism and its relevance to typical bridge conditions remain uncertain.",
      C: "It is unexpected because the initial report received little enthusiasm from materials scientists.",
      D: "It is unfairly dismissive because Text 1 ignores successful large-scale highway trials already completed.",
    },
    correct: "B",
  },
];

export const ALL_PROBLEMS: Problem[] = [...PRETEST, ...LEARNING, ...TEST];

export interface StudyStep {
  phase: Phase;
  /** 0-based position within the phase, in the order shown */
  index: number;
  problem: Problem;
}

/** A fresh random order of the main-phase problem ids (Fisher–Yates). */
export function shuffledLearningOrder(random: () => number = Math.random): string[] {
  const ids = LEARNING.map((p) => p.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
  }
  return ids;
}

/**
 * Practice (fixed) → main problems in the participant's random order → final
 * problems in fixed order. Falls back to the default order if `learningOrder`
 * isn't a valid permutation (e.g. an old saved session).
 */
export function buildStudySteps(learningOrder?: string[]): StudyStep[] {
  const valid =
    !!learningOrder &&
    learningOrder.length === LEARNING.length &&
    new Set(learningOrder).size === LEARNING.length &&
    learningOrder.every((id) => LEARNING.some((p) => p.id === id));
  const learning = valid
    ? learningOrder.map((id) => LEARNING.find((p) => p.id === id)!)
    : LEARNING;
  return [
    ...PRETEST.map((problem, index) => ({ phase: "pretest" as const, index, problem })),
    ...learning.map((problem, index) => ({ phase: "learning" as const, index, problem })),
    ...TEST.map((problem, index) => ({ phase: "test" as const, index, problem })),
  ];
}

export const TOTAL_PROBLEMS = ALL_PROBLEMS.length;

export const PHASE_COUNTS: Record<Phase, number> = {
  pretest: PRETEST.length,
  learning: LEARNING.length,
  test: TEST.length,
};

export function findProblem(id: string): Problem | undefined {
  return ALL_PROBLEMS.find((p) => p.id === id);
}
