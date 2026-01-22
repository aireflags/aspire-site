
import { ToolItem } from './types';

// Helper function to get favicon URL
const getFaviconUrl = (url: string): string => {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
};

export const ENTERPRISE_TOOLS: ToolItem[] = [
  {
    id: 'onboard',
    title: 'Onboard',
    subtitle: 'Lark Suite',
    icon: 'link',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://z1wxnr4c1l.sg.larksuite.com/wiki/PebSwDggQiJubXkPorglWkQ6gnf',
    iconUrl: getFaviconUrl('https://www.larksuite.com/en_sg/')
  },
  {
    id: 'files',
    title: 'Files',
    subtitle: 'Google Drive',
    icon: 'folder',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://drive.google.com/',
    iconUrl: getFaviconUrl('https://drive.google.com/')
  },
  {
    id: 'car',
    title: 'CAR',
    subtitle: 'California Association',
    icon: 'link',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://www.car.org/',
    iconUrl: getFaviconUrl('https://www.car.org/')
  },
  {
    id: 'zipform',
    title: 'Zipform',
    subtitle: 'Document Management',
    icon: 'description',
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-500/10',
    url: 'https://www.zipformplus.com/',
    iconUrl: getFaviconUrl('https://www.zipformplus.com/')
  },
  {
    id: 'mls',
    title: 'MLS',
    subtitle: 'MLS Listings',
    icon: 'home',
    colorClass: 'text-green-500',
    bgClass: 'bg-green-500/10',
    url: 'https://pro.mlslistings.com/',
    iconUrl: getFaviconUrl('https://pro.mlslistings.com/')
  },
  {
    id: 'silvar',
    title: 'Silvar',
    subtitle: 'Silicon Valley Association',
    icon: 'link',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://www.silvar.org/',
    iconUrl: getFaviconUrl('https://www.silvar.org/')
  },
  {
    id: 'mic',
    title: 'MIC',
    subtitle: 'Member Portal',
    icon: 'login',
    colorClass: 'text-orange-500',
    bgClass: 'bg-orange-500/10',
    url: 'https://go.sccaor.com/MIC/Login',
    iconUrl: getFaviconUrl('https://go.sccaor.com/MIC/Login')
  },
  {
    id: 'bayeast',
    title: 'BayEast',
    subtitle: 'Bay East Association',
    icon: 'link',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://bayeast.org/',
    iconUrl: getFaviconUrl('https://bayeast.org/')
  },
  {
    id: 'ivaor',
    title: 'IVAOR',
    subtitle: 'Inland Valley Association',
    icon: 'link',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://www.ivaor.com/',
    iconUrl: getFaviconUrl('https://www.ivaor.com/')
  },
  {
    id: 'nar',
    title: 'NAR',
    subtitle: 'National Association',
    icon: 'link',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://www.nar.realtor/',
    iconUrl: getFaviconUrl('https://www.nar.realtor/')
  },
  {
    id: 'dre',
    title: 'DRE',
    subtitle: 'Department of Real Estate',
    icon: 'verified_user',
    colorClass: 'text-green-500',
    bgClass: 'bg-green-500/10',
    url: 'https://secure.dre.ca.gov/',
    iconUrl: getFaviconUrl('https://secure.dre.ca.gov/')
  },
  {
    id: 'docusign',
    title: 'DocuSign',
    subtitle: 'Electronic Signatures',
    icon: 'edit_document',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://www.docusign.com/',
    iconUrl: getFaviconUrl('https://www.docusign.com/')
  },
  {
    id: 'disclosures-io',
    title: 'DisclosuresIO',
    subtitle: 'Disclosure Management',
    icon: 'description',
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-500/10',
    url: 'https://disclosures.io/',
    iconUrl: getFaviconUrl('https://disclosures.io/')
  },
  {
    id: 'zoom',
    title: 'Zoom',
    subtitle: 'Video Conferencing',
    icon: 'video_call',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://www.zoom.com/',
    iconUrl: getFaviconUrl('https://www.zoom.com/')
  },
  {
    id: 'calendly',
    title: 'Calendly',
    subtitle: 'Schedule Meetings',
    icon: 'calendar_month',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://calendly.com',
    iconUrl: getFaviconUrl('https://calendly.com')
  },
  {
    id: 'wiseagent',
    title: 'WiseAgent',
    subtitle: 'Real Estate Platform',
    icon: 'link',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    url: 'https://wiseagent.com/',
    iconUrl: getFaviconUrl('https://wiseagent.com/')
  },
  {
    id: 'canvapro',
    title: 'CanvaPro',
    subtitle: 'Design Platform',
    icon: 'palette',
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-500/10',
    url: 'https://www.canva.com/canva-business/',
    iconUrl: getFaviconUrl('https://www.canva.com/canva-business/')
  }
];
