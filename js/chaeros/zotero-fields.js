const zoteroFields = {
  artwork: {
    title: "",
    abstractNote: "",
    artworkMedium: "",
    artworkSize: "",
    date: "",
    language: "",
    shortTitle: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    url: "",
    accessDate: "",
    rights: "",
    extra: "",
    creator: "",
  },
  attachment: { title: "", accessDate: "", url: "" },
  audioRecording: {
    title: "",
    abstractNote: "",
    audioRecordingFormat: "",
    seriesTitle: "",
    volume: "",
    numberOfVolumes: "",
    place: "",
    label: "",
    date: "",
    runningTime: "",
    language: "",
    ISBN: "",
    shortTitle: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    url: "",
    accessDate: "",
    rights: "",
    extra: "",
    creator: "",
  },
  bill: {
    title: "",
    abstractNote: "",
    billNumber: "",
    code: "",
    codeVolume: "",
    section: "",
    codePages: "",
    legislativeBody: "",
    session: "",
    history: "",
    date: "",
    language: "",
    url: "",
    accessDate: "",
    shortTitle: "",
    rights: "",
    extra: "",
    creator: "",
  },
  blogPost: {
    title: "",
    abstractNote: "",
    blogTitle: "",
    websiteType: "",
    date: "",
    url: "",
    accessDate: "",
    language: "",
    shortTitle: "",
    rights: "",
    extra: "",
    creator: "",
  },
  book: {
    title: "",
    abstractNote: "",
    series: "",
    seriesNumber: "",
    volume: "",
    numberOfVolumes: "",
    edition: "",
    place: "",
    publisher: "",
    date: "",
    numPages: "",
    language: "",
    ISBN: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  bookSection: {
    title: "",
    abstractNote: "",
    bookTitle: "",
    series: "",
    seriesNumber: "",
    volume: "",
    numberOfVolumes: "",
    edition: "",
    place: "",
    publisher: "",
    date: "",
    pages: "",
    language: "",
    ISBN: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  case: {
    caseName: "",
    abstractNote: "",
    court: "",
    dateDecided: "",
    docketNumber: "",
    reporter: "",
    reporterVolume: "",
    firstPage: "",
    history: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    rights: "",
    extra: "",
    creator: "",
  },
  computerProgram: {
    title: "",
    abstractNote: "",
    seriesTitle: "",
    versionNumber: "",
    date: "",
    system: "",
    place: "",
    company: "",
    programmingLanguage: "",
    ISBN: "",
    shortTitle: "",
    url: "",
    rights: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    accessDate: "",
    extra: "",
    creator: "",
  },
  conferencePaper: {
    title: "",
    abstractNote: "",
    date: "",
    proceedingsTitle: "",
    conferenceName: "",
    place: "",
    publisher: "",
    volume: "",
    pages: "",
    series: "",
    language: "",
    DOI: "",
    ISBN: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  dictionaryEntry: {
    title: "",
    abstractNote: "",
    dictionaryTitle: "",
    series: "",
    seriesNumber: "",
    volume: "",
    numberOfVolumes: "",
    edition: "",
    place: "",
    publisher: "",
    date: "",
    pages: "",
    language: "",
    ISBN: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  document: {
    title: "",
    abstractNote: "",
    publisher: "",
    date: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  email: {
    subject: "",
    abstractNote: "",
    date: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    language: "",
    rights: "",
    extra: "",
    creator: "",
  },
  encyclopediaArticle: {
    title: "",
    abstractNote: "",
    encyclopediaTitle: "",
    series: "",
    seriesNumber: "",
    volume: "",
    numberOfVolumes: "",
    edition: "",
    place: "",
    publisher: "",
    date: "",
    pages: "",
    ISBN: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    language: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  film: {
    title: "",
    abstractNote: "",
    distributor: "",
    date: "",
    genre: "",
    videoRecordingFormat: "",
    runningTime: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  forumPost: {
    title: "",
    abstractNote: "",
    forumTitle: "",
    postType: "",
    date: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    rights: "",
    extra: "",
    creator: "",
  },
  hearing: {
    title: "",
    abstractNote: "",
    committee: "",
    place: "",
    publisher: "",
    numberOfVolumes: "",
    documentNumber: "",
    pages: "",
    legislativeBody: "",
    session: "",
    history: "",
    date: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    rights: "",
    extra: "",
    creator: "",
  },
  instantMessage: {
    title: "",
    abstractNote: "",
    date: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    rights: "",
    extra: "",
    creator: "",
  },
  interview: {
    title: "",
    abstractNote: "",
    date: "",
    interviewMedium: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  journalArticle: {
    title: "",
    abstractNote: "",
    publicationTitle: "",
    volume: "",
    issue: "",
    pages: "",
    date: "",
    series: "",
    seriesTitle: "",
    seriesText: "",
    journalAbbreviation: "",
    language: "",
    DOI: "",
    ISSN: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  letter: {
    title: "",
    abstractNote: "",
    letterType: "",
    date: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  magazineArticle: {
    title: "",
    abstractNote: "",
    publicationTitle: "",
    volume: "",
    issue: "",
    date: "",
    pages: "",
    language: "",
    ISSN: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  manuscript: {
    title: "",
    abstractNote: "",
    manuscriptType: "",
    place: "",
    date: "",
    numPages: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  map: {
    title: "",
    abstractNote: "",
    mapType: "",
    scale: "",
    seriesTitle: "",
    edition: "",
    place: "",
    publisher: "",
    date: "",
    language: "",
    ISBN: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  newspaperArticle: {
    title: "",
    abstractNote: "",
    publicationTitle: "",
    place: "",
    edition: "",
    date: "",
    section: "",
    pages: "",
    language: "",
    shortTitle: "",
    ISSN: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  note: "",
  patent: {
    title: "",
    abstractNote: "",
    place: "",
    country: "",
    assignee: "",
    issuingAuthority: "",
    patentNumber: "",
    filingDate: "",
    pages: "",
    applicationNumber: "",
    priorityNumbers: "",
    issueDate: "",
    references: "",
    legalStatus: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    rights: "",
    extra: "",
    creator: "",
  },
  podcast: {
    title: "",
    abstractNote: "",
    seriesTitle: "",
    episodeNumber: "",
    audioFileType: "",
    runningTime: "",
    url: "",
    accessDate: "",
    language: "",
    shortTitle: "",
    rights: "",
    extra: "",
    creator: "",
  },
  presentation: {
    title: "",
    abstractNote: "",
    presentationType: "",
    date: "",
    place: "",
    meetingName: "",
    url: "",
    accessDate: "",
    language: "",
    shortTitle: "",
    rights: "",
    extra: "",
    creator: "",
  },
  radioBroadcast: {
    title: "",
    abstractNote: "",
    programTitle: "",
    episodeNumber: "",
    audioRecordingFormat: "",
    place: "",
    network: "",
    date: "",
    runningTime: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  report: {
    title: "",
    abstractNote: "",
    reportNumber: "",
    reportType: "",
    seriesTitle: "",
    place: "",
    institution: "",
    date: "",
    pages: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  statute: {
    nameOfAct: "",
    abstractNote: "",
    code: "",
    codeNumber: "",
    publicLawNumber: "",
    dateEnacted: "",
    pages: "",
    section: "",
    session: "",
    history: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    rights: "",
    extra: "",
    creator: "",
  },
  thesis: {
    title: "",
    abstractNote: "",
    thesisType: "",
    university: "",
    place: "",
    date: "",
    numPages: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  tvBroadcast: {
    title: "",
    abstractNote: "",
    programTitle: "",
    episodeNumber: "",
    videoRecordingFormat: "",
    place: "",
    network: "",
    date: "",
    runningTime: "",
    language: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  videoRecording: {
    title: "",
    abstractNote: "",
    videoRecordingFormat: "",
    seriesTitle: "",
    volume: "",
    numberOfVolumes: "",
    place: "",
    studio: "",
    date: "",
    runningTime: "",
    language: "",
    ISBN: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
  webpage: {
    title: "",
    abstractNote: "",
    websiteTitle: "",
    websiteType: "",
    date: "",
    shortTitle: "",
    url: "",
    accessDate: "",
    language: "",
    rights: "",
    extra: "",
    creator: "",
  },
  annotation: "",
  preprint: {
    title: "",
    abstractNote: "",
    genre: "",
    repository: "",
    archiveID: "",
    place: "",
    date: "",
    series: "",
    seriesNumber: "",
    DOI: "",
    citationKey: "",
    url: "",
    accessDate: "",
    archive: "",
    archiveLocation: "",
    shortTitle: "",
    language: "",
    libraryCatalog: "",
    callNumber: "",
    rights: "",
    extra: "",
    creator: "",
  },
};

export { zoteroFields };
