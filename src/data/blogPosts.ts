import { kitchenCost2025Content } from './blogContent/kitchenCost2025';
import { bathroomTilesContent } from './blogContent/bathroomTiles';
import { homeValueIncreaseContent } from './blogContent/homeValueIncrease';
import { budgetingGuideContent } from './blogContent/budgetingGuide';
import { kitchenTimelineContent } from './blogContent/kitchenTimeline';
import { bathroomCostContent } from './blogContent/bathroomCost';
import { choosingContractorContent } from './blogContent/choosingContractor';
import { roiComparisonContent } from './blogContent/roiComparison';
import { permitRequirementsContent } from './blogContent/permitRequirements';
import { designTrends2025Content } from './blogContent/designTrends2025';
import { openConceptRemodelingContent } from './blogContent/openConceptRemodeling';
import { energyEfficientUpgradesContent } from './blogContent/energyEfficientUpgrades';
import { basementFinishingContent } from './blogContent/basementFinishing';
import { outdoorLivingSpacesContent } from './blogContent/outdoorLivingSpaces';
import { smartHomeIntegrationContent } from './blogContent/smartHomeIntegration';
import { agingInPlaceContent } from './blogContent/agingInPlace';
import { ecoFriendlyMaterialsContent } from './blogContent/ecoFriendlyMaterials';
import { homeOfficeRenovationContent } from './blogContent/homeOfficeRenovation';
import { masterSuiteAdditionContent } from './blogContent/masterSuiteAddition';
import { wholeHouseRemodelContent } from './blogContent/wholeHouseRemodel';
import { deckBuildingContent } from './blogContent/deckBuilding';
import { tilingContent } from './blogContent/tiling';
import { blogKeywords } from './blogKeywords';




export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  image: string;
  keywords?: string[];
  author: {
    name: string;
    bio: string;
    image: string;
    credentials: string;
  };
}


export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'How Much Does a Kitchen Renovation Cost in 2025?',
    excerpt: 'Complete breakdown of kitchen renovation costs including materials, labor, and hidden expenses you need to budget for.',
    content: kitchenCost2025Content,
    date: '2025-10-01',
    readTime: '12 min',
    category: 'Cost Guide',
    slug: 'kitchen-renovation-cost-2025',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759551851188_a3094897.webp',
    keywords: ['kitchen renovation cost', 'kitchen remodel budget', 'kitchen renovation prices 2025', 'kitchen remodeling expenses', 'Los Angeles kitchen renovation', 'kitchen renovation contractor'],
    author: {
      name: 'Hein Hoven',
      bio: 'Award-Winning General Contractor in Los Angeles with 15+ years and 500+ completed projects',
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759548898367_138abc8e.jpeg',
      credentials: 'CA License #1118018, EPA LEED Certified'
    }
  },

  {
    id: 2,
    title: 'Complete Guide to Bathroom Tile Options',
    excerpt: 'Everything you need to know about choosing the perfect tiles for your bathroom renovation, from materials to installation.',
    content: bathroomTilesContent,
    date: '2025-09-28',
    readTime: '14 min',
    category: 'Design Guide',
    slug: 'bathroom-tile-options-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759551851973_34d4cb4d.webp',
    keywords: ['bathroom tiles', 'bathroom tile options', 'tile installation', 'bathroom remodel tiles', 'ceramic vs porcelain tiles', 'bathroom tile design'],
    author: {
      name: 'Sarah Martinez',
      bio: 'Interior Designer specializing in bathroom and kitchen design with 12 years of experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      credentials: 'NCIDQ Certified, ASID Member'
    }
  },

  {
    id: 3,
    title: 'Which Renovations Increase Home Value the Most?',
    excerpt: 'Discover which home improvements offer the best return on investment and add the most value to your property.',
    content: homeValueIncreaseContent,
    date: '2025-09-25',
    readTime: '15 min',
    category: 'Investment',
    slug: 'home-value-increase-renovations',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759551852772_9524a774.webp',
    keywords: blogKeywords[3],
    author: {
      name: 'David Thompson',
      bio: 'Real Estate Appraiser and Renovation Consultant with 20 years analyzing home improvement ROI',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      credentials: 'Certified Residential Appraiser, MAI'
    }
  },
  {
    id: 4,
    title: 'Complete Renovation Budgeting Guide',
    excerpt: 'Learn how to create a realistic renovation budget, avoid cost overruns, and finance your home improvement project.',
    content: budgetingGuideContent,
    date: '2025-09-22',
    readTime: '16 min',
    category: 'Planning',
    slug: 'renovation-budgeting-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759551853535_299ebf71.webp',
    keywords: blogKeywords[4],
    author: {
      name: 'Jennifer Lee',
      bio: 'Financial Planner specializing in home renovation financing and budget management',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      credentials: 'CFP, MBA'
    }
  },

  {
    id: 5,
    title: 'Kitchen Renovation Timeline: What to Expect',
    excerpt: 'Week-by-week breakdown of the kitchen renovation process, from demolition to final inspection.',
    content: kitchenTimelineContent,
    date: '2025-09-19',
    readTime: '13 min',
    category: 'Planning',
    slug: 'kitchen-renovation-timeline',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759551854270_aead13ca.webp',
    author: {
      name: 'Hein Hoven',
      bio: 'Award-Winning General Contractor in Los Angeles with 15+ years and 500+ completed projects',
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759548898367_138abc8e.jpeg',
      credentials: 'CA License #1118018, EPA LEED Certified'
    }
  },
  {
    id: 6,
    title: 'Bathroom Renovation Cost Breakdown 2025',
    excerpt: 'Detailed cost analysis of bathroom renovations including fixtures, materials, labor, and hidden expenses.',
    content: bathroomCostContent,
    date: '2025-09-16',
    readTime: '14 min',
    category: 'Cost Guide',
    slug: 'bathroom-renovation-cost-breakdown',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759551863381_84bc4af2.webp',
    author: {
      name: 'Sarah Martinez',
      bio: 'Interior Designer specializing in bathroom and kitchen design with 12 years of experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      credentials: 'NCIDQ Certified, ASID Member'
    }
  },
  {
    id: 7,
    title: 'How to Choose the Right Contractor',
    excerpt: 'Essential guide to vetting, hiring, and working with contractors for your home renovation project.',
    content: choosingContractorContent,
    date: '2025-09-13',
    readTime: '15 min',
    category: 'Planning',
    slug: 'choosing-right-contractor',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759551864141_ba4bea27.webp',
    author: {
      name: 'Robert Johnson',
      bio: 'Construction Attorney and Homeowner Advocate with 18 years protecting clients in renovation contracts',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      credentials: 'JD, Construction Law Specialist'
    }
  },
  {
    id: 8,
    title: 'ROI Comparison: Which Home Improvements Pay Off?',
    excerpt: 'Compare return on investment for different renovation projects and make data-driven improvement decisions.',
    content: roiComparisonContent,
    date: '2025-09-10',
    readTime: '16 min',
    category: 'Investment',
    slug: 'roi-comparison-home-improvements',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759551864891_a5f28b60.webp',
    author: {
      name: 'David Thompson',
      bio: 'Real Estate Appraiser and Renovation Consultant with 20 years analyzing home improvement ROI',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      credentials: 'Certified Residential Appraiser, MAI'
    }
  },
  {
    id: 9,
    title: 'Permit Requirements for Home Renovations',
    excerpt: 'Complete guide to understanding when you need permits, how to obtain them, and avoiding costly mistakes.',
    content: permitRequirementsContent,
    date: '2025-09-07',
    readTime: '14 min',
    category: 'Legal',
    slug: 'permit-requirements-renovations',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759551865801_d4f043e1.webp',
    author: {
      name: 'Amanda Foster',
      bio: 'Building Inspector and Code Compliance Expert with 15 years in municipal building departments',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      credentials: 'ICC Certified Building Inspector'
    }
  },
  {
    id: 10,
    title: 'Home Design Trends 2025: What\'s In and What\'s Out',
    excerpt: 'Explore the latest design trends in colors, materials, layouts, and styles shaping home renovations in 2025.',
    content: designTrends2025Content,
    date: '2025-09-04',
    readTime: '13 min',
    category: 'Design Guide',
    slug: 'design-trends-2025',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759551866566_cc6d91be.webp',
    author: {
      name: 'Sarah Martinez',
      bio: 'Interior Designer specializing in bathroom and kitchen design with 12 years of experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      credentials: 'NCIDQ Certified, ASID Member'
    }
  },
  {
    id: 11,
    title: 'Open Concept Remodeling: Complete Guide to Creating Your Dream Space',
    excerpt: 'Transform your traditional floor plan into a modern, flowing space with this comprehensive guide to open concept design, costs, and execution.',
    content: openConceptRemodelingContent,
    date: '2025-09-01',
    readTime: '18 min',
    category: 'Design Guide',
    slug: 'open-concept-remodeling-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759597629081_39cdfae1.webp',
    author: {
      name: 'Sarah Martinez',
      bio: 'Interior Designer specializing in bathroom and kitchen design with 12 years of experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      credentials: 'NCIDQ Certified, ASID Member'
    }
  },
  {
    id: 12,
    title: 'Energy-Efficient Home Upgrades: Save Money While Helping the Environment',
    excerpt: 'Discover the most effective energy-efficient upgrades that reduce utility bills by 25-50% while increasing home value and comfort.',
    content: energyEfficientUpgradesContent,
    date: '2025-08-29',
    readTime: '20 min',
    category: 'Investment',
    slug: 'energy-efficient-home-upgrades',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759597629909_51edda7c.webp',
    author: {
      name: 'David Thompson',
      bio: 'Real Estate Appraiser and Renovation Consultant with 20 years analyzing home improvement ROI',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      credentials: 'Certified Residential Appraiser, MAI'
    }
  },
  {
    id: 13,
    title: 'Complete Basement Finishing Guide: Transform Unused Space Into Valuable Living Area',
    excerpt: 'Add 500-1,000 square feet of finished living space with this comprehensive guide to basement finishing, from planning to completion.',
    content: basementFinishingContent,
    date: '2025-08-26',
    readTime: '19 min',
    category: 'Cost Guide',
    slug: 'basement-finishing-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759597630689_9012c3bf.webp',
    author: {
      name: 'Hein Hoven',
      bio: 'Award-Winning General Contractor in Los Angeles with 15+ years and 500+ completed projects',
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759548898367_138abc8e.jpeg',
      credentials: 'CA License #1118018, EPA LEED Certified'
    }
  },
  {
    id: 14,
    title: 'Outdoor Living Spaces: Design and Build Your Perfect Backyard Retreat',
    excerpt: 'Create your dream outdoor living space with this complete guide to patios, outdoor kitchens, fire features, and more.',
    content: outdoorLivingSpacesContent,
    date: '2025-08-23',
    readTime: '21 min',
    category: 'Design Guide',
    slug: 'outdoor-living-spaces-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759597631498_92c8a817.webp',
    author: {
      name: 'Sarah Martinez',
      bio: 'Interior Designer specializing in bathroom and kitchen design with 12 years of experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      credentials: 'NCIDQ Certified, ASID Member'
    }
  },
  {
    id: 15,
    title: 'Smart Home Integration: Complete Guide to Modern Home Automation',
    excerpt: 'Transform your home with smart technology that offers convenience, energy savings, security, and increased home value.',
    content: smartHomeIntegrationContent,
    date: '2025-08-20',
    readTime: '22 min',
    category: 'Technology',
    slug: 'smart-home-integration-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759597632242_1c89f167.webp',
    author: {
      name: 'James Wilson',
      bio: 'Smart Home Technology Specialist and Home Automation Consultant with 10 years of experience',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      credentials: 'CEDIA Certified, Smart Home Professional'
    }
  },
  {
    id: 16,
    title: 'Aging in Place Remodeling: Create a Safe, Comfortable Home for Life',
    excerpt: 'Essential modifications that enhance safety, accessibility, and comfort while maintaining your home\'s beauty and value.',
    content: agingInPlaceContent,
    date: '2025-08-17',
    readTime: '20 min',
    category: 'Planning',
    slug: 'aging-in-place-remodeling',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759597643145_f44e8dba.webp',
    author: {
      name: 'Hein Hoven',
      bio: 'Award-Winning General Contractor in Los Angeles with 15+ years and 500+ completed projects',
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759548898367_138abc8e.jpeg',
      credentials: 'CA License #1118018, EPA LEED Certified, CAPS'
    }
  },
  {
    id: 17,
    title: 'Eco-Friendly Building Materials: Complete Guide to Sustainable Remodeling',
    excerpt: 'Reduce environmental impact while creating healthier homes with this comprehensive guide to sustainable building materials.',
    content: ecoFriendlyMaterialsContent,
    date: '2025-08-14',
    readTime: '23 min',
    category: 'Design Guide',
    slug: 'eco-friendly-building-materials',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759597643971_732280c1.webp',
    author: {
      name: 'Emily Green',
      bio: 'Sustainable Building Consultant and LEED Accredited Professional with 14 years in green construction',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      credentials: 'LEED AP, Green Building Specialist'
    }
  },
  {
    id: 18,
    title: 'Home Office Renovation: Design Your Perfect Productive Workspace',
    excerpt: 'Create the ultimate home office with this comprehensive guide to planning, design, technology integration, and productivity optimization.',
    content: homeOfficeRenovationContent,
    date: '2025-08-11',
    readTime: '21 min',
    category: 'Design Guide',
    slug: 'home-office-renovation-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759597644735_cb4f7dde.webp',
    author: {
      name: 'Sarah Martinez',
      bio: 'Interior Designer specializing in bathroom and kitchen design with 12 years of experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      credentials: 'NCIDQ Certified, ASID Member'
    }
  },
  {
    id: 19,
    title: 'Master Suite Addition: Complete Guide to Creating Your Private Retreat',
    excerpt: 'Add $75,000-$200,000+ to your home value with this comprehensive guide to planning and executing a master suite addition.',
    content: masterSuiteAdditionContent,
    date: '2025-08-08',
    readTime: '24 min',
    category: 'Cost Guide',
    slug: 'master-suite-addition-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759597645743_34434cba.webp',
    author: {
      name: 'Hein Hoven',
      bio: 'Award-Winning General Contractor in Los Angeles with 15+ years and 500+ completed projects',
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759548898367_138abc8e.jpeg',
      credentials: 'CA License #1118018, EPA LEED Certified'
    }
  },
  {
    id: 20,
    title: 'Whole House Remodeling: Complete Timeline and Planning Guide',
    excerpt: 'Navigate the complex process of whole house remodeling with this comprehensive 6-9 month timeline and planning guide.',
    content: wholeHouseRemodelContent,
    date: '2025-08-05',
    readTime: '25 min',
    category: 'Planning',
    slug: 'whole-house-remodeling-timeline',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759597646492_d1c9b295.webp',
    author: {
      name: 'Hein Hoven',
      bio: 'Award-Winning General Contractor in Los Angeles with 15+ years and 500+ completed projects',
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759548898367_138abc8e.jpeg',
      credentials: 'CA License #1118018, EPA LEED Certified'
    }
  },
  {
    id: 21,
    title: 'Complete Guide to Building a Deck: Design, Materials, and Installation',
    excerpt: 'Transform your outdoor living with this comprehensive guide to deck building, from planning and material selection to construction and maintenance.',
    content: deckBuildingContent,
    date: '2025-10-04',
    readTime: '19 min',
    category: 'Cost Guide',
    slug: 'deck-building-complete-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759677458103_19fe3b40.webp',
    keywords: ['deck building', 'deck construction', 'deck materials', 'composite decking', 'deck cost', 'outdoor deck', 'deck installation', 'Los Angeles deck builder'],
    author: {
      name: 'Hein Hoven',
      bio: 'Award-Winning General Contractor in Los Angeles with 15+ years and 500+ completed projects',
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759548898367_138abc8e.jpeg',
      credentials: 'CA License #1118018, EPA LEED Certified'
    }
  },
  {
    id: 22,
    title: 'Professional Tile Installation Guide: Techniques, Materials, and Best Practices',
    excerpt: 'Master the art of tile installation with this expert guide covering material selection, proper techniques, and professional tips for lasting results.',
    content: tilingContent,
    date: '2025-10-03',
    readTime: '18 min',
    category: 'Design Guide',
    slug: 'professional-tile-installation-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759677462481_e94415fd.webp',
    keywords: ['tile installation', 'ceramic tile', 'porcelain tile', 'tile patterns', 'bathroom tile', 'kitchen backsplash', 'tile cost', 'professional tiling', 'Los Angeles tile contractor'],
    author: {
      name: 'Hein Hoven',
      bio: 'Award-Winning General Contractor in Los Angeles with 15+ years and 500+ completed projects',
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1759548898367_138abc8e.jpeg',
      credentials: 'CA License #1118018, EPA LEED Certified'
    }
  }

];

