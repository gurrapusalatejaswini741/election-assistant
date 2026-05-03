export const VIDEOS = [
  { id:'voter_registration', title:'Voter Registration Process', titleTa:'வாக்காளர் பதிவு செயல்முறை',
    description:"Learn how to register as a voter in India using Form 6 online and offline",
    descriptionTa:'Form 6 மூலம் வாக்காளராக பதிவு செய்வது எப்படி',
    youtubeId:'jfhVos9WxTQ', keywords:['register','registration','voter id','form 6','epic','பதிவு'],
    category:'registration', duration:'4:32' },
  { id:'evm_voting', title:'How to Vote Using EVM', titleTa:'EVM மூலம் வாக்களிப்பது எப்படி',
    description:'Step-by-step guide to casting your vote at the polling booth using Electronic Voting Machine',
    descriptionTa:'வாக்குச் சாவடியில் EVM மூலம் வாக்களிப்பது பற்றிய வழிகாட்டி',
    youtubeId:'Uw0iq3FS4Dc', keywords:['vote','evm','booth','polling','voting machine','வாக்களி'],
    category:'voting', duration:'3:15' },
  { id:'election_stages', title:'Stages of Indian General Elections', titleTa:'இந்திய பொதுத் தேர்தலின் நிலைகள்',
    description:"Overview of how India's general election is conducted in multiple phases",
    descriptionTa:'இந்தியாவின் பொதுத் தேர்தல் பல கட்டங்களில் எவ்வாறு நடத்தப்படுகிறது',
    youtubeId:'MvlK_LxEfMg', keywords:['stages','phases','schedule','general election','lok sabha','நிலைகள்'],
    category:'process', duration:'6:47' },
  { id:'counting_results', title:'How Votes Are Counted & Results Declared', titleTa:'வாக்குகள் எவ்வாறு எண்ணப்படுகின்றன',
    description:'Understand the vote counting process and how election results are officially announced',
    descriptionTa:'வாக்கு எண்ணும் செயல்முறை மற்றும் தேர்தல் முடிவுகள் அதிகாரப்பூர்வமாக எவ்வாறு அறிவிக்கப்படுகின்றன',
    youtubeId:'A8UPpNwZEj0', keywords:['count','counting','results','declare','winner','முடிவுகள்'],
    category:'results', duration:'5:20' },
  { id:'model_code', title:'Model Code of Conduct Explained', titleTa:'நடத்தை விதிமுறை விளக்கம்',
    description:"What is the Model Code of Conduct and how it ensures free and fair elections",
    descriptionTa:'நடத்தை விதிமுறை என்றால் என்ன மற்றும் அது சுதந்திரமான தேர்தலை உறுதி செய்வது எவ்வாறு',
    youtubeId:'rdMFMVXh6rA', keywords:['model code','conduct','mcc','rules','fair election'],
    category:'rules', duration:'4:10' },
];

export function findRelevantVideo(message) {
  if (!message) return null;
  const lower = message.toLowerCase();
  let best = null, bestScore = 0;
  for (const video of VIDEOS) {
    const score = video.keywords.reduce((acc,kw) => acc + (lower.includes(kw.toLowerCase()) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = video; }
  }
  return bestScore > 0 ? best : null;
}
