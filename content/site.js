// MAIN CONFIGURATION: edit text and rearrange section IDs here.
window.PORTFOLIO = window.PORTFOLIO || {};
window.PORTFOLIO.site = {
  name: "Nick Moore",
  portrait: "assets/nick-moore-portrait.jpg", // Replace this file to update the public portrait
  headline: "Technology. Creativity. Curiosity.",
  tagline: "A little bit of everything. Never a dull moment. A Nick of all trades. Master of a few.",
  introduction: "I'm Nick Moore, a technology enthusiast, creative thinker and experienced professional with a background spanning digital communications, customer service, leadership and the creative industries.",
  about: "These days I'm expanding my technical expertise into cybersecurity while continuing to develop software, explore new ideas and occasionally pursue projects that are a little outside the ordinary. This website brings together my professional experience, creative work and a few unexpected adventures along the way.",
  // Leave unknown links blank. They will not appear publicly.
  links: { linkedin: "", email: "", youtube: "", spotify: "" },
  // Change the order here. Each section ID must appear only once.
  sectionOrder: ["welcome", "about", "profiles", "experience-qualifications", "projects", "achievements", "journey", "cv", "music", "books", "hobbies", "contact"],
  sectionNames: {welcome:"Welcome",about:"About Me",profiles:"Professional Profiles","experience-qualifications":"Experience & Qualifications",projects:"Projects",achievements:"Achievements & Adventures",journey:"My Journey",cv:"Curriculum Vitae",music:"Music",books:"Books",hobbies:"Beyond the Desk",contact:"Contact"},
  projectCategories: [
    {id:"technology",label:"Technology & Software"},
    {id:"ventures",label:"Businesses & Ventures"},
    {id:"campaigns",label:"Campaigns & Stunts"},
    {id:"creative",label:"Creative Industries"}
  ]
};
