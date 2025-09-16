export const VALID_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

export const PERSONA_TRAITS = [
  {
    title: 'Direct & Concise',
    description: 'Provides clear, straightforward responses',
  },
  {
    title: 'Friendly & Conversational',
    description: 'Uses warm, conversational language',
  },
  {
    title: 'Detailed & Thorough',
    description: 'Provides comprehensive, detailed information',
  },
  {
    title: 'Creative & Engaging',
    description: 'Uses varied, interesting language styles',
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      'Integrating our custom AI chatbot was a breeze. The intuitive setup and one-line embed code have revolutionized our customer support. #AICustomerSupport #Innovation',
    name: 'Alex Carter',
    designation: 'Product Manager at SmartHelp Inc.',
    src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3', // Male
    rating: 5,
  },
  {
    quote:
      'Our new chatbot not only reduced our response times dramatically but also aligned perfectly with our brand voice. The documentation feature and seamless integration impressed us all. #Chatbot #SeamlessIntegration',
    name: 'Grace Thompson',
    designation: 'Head of Support at QuickAssist',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3', // Female
    rating: 5,
  },
  {
    quote:
      'We love how the chatbot uses our own expertise materials to provide precise answers. The analytics dashboard gives us real-time insights, making it easy to improve our support. #RealTimeAnalytics #CustomerFirst',
    name: 'Jonathan Lee',
    designation: 'Operations Director at LiveAnswer',
    src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3', // Male
    rating: 4,
  },
  {
    quote:
      'The speed and accuracy of the AI response system are truly impressive. Our customers appreciate the immediate assistance, and our support team enjoys the smooth handover when human intervention is needed. #AIChatbot #ImmediateAssistance',
    name: 'Nina Patel',
    designation: 'Customer Experience Lead at CloudServe',
    src: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3', // Female
    rating: 5,
  },
  {
    quote:
      'This service made our support process so efficient. By using our own documentation for training, every answer feels personalized and accurate. #PersonalizedSupport #Efficient',
    name: 'Robert Miller',
    designation: 'Founder & CEO at DocuBot',
    src: 'https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3', // Male
    rating: 5,
  },
  {
    quote:
      'The self-service nature of this tool is outstanding. I could manage updates on my own without needing constant developer support. #DIYSupport #Empowerment',
    name: 'Brian Davies',
    designation: 'Small Business Owner at CaféBridge',
    src: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3', // Male
    rating: 4,
  },
  {
    quote:
      'The migration from a free to an Enterprise plan was incredibly smooth. The dedicated support during the transition made all the difference. #EnterpriseReady #SmoothTransition',
    name: 'Sophia Martin',
    designation: 'Operations Manager at Global Answers',
    src: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3', // Female
    rating: 5,
  },
  {
    quote:
      'I was particularly impressed with how the chat interface restores previous sessions seamlessly. This creates a continuous, engaging experience for our users. #UserExperience #SeamlessChat',
    name: 'Oliver Black',
    designation: 'UX Designer at WebCraft',
    src: 'https://images.unsplash.com/photo-1632255657991-ce622acebecd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRmb2xpbyUyMHByb2Zlc3Npb25hbHxlbnwwfHwwfHx8MA%3D%3D', // Male
    rating: 4,
  },
  {
    quote:
      'Switching to a live agent is so smooth when needed. This backup ensures that our customers always receive the best possible support. #HumanFallback #CustomerCare',
    name: 'Emily Richards',
    designation: 'Customer Success Manager at HumanConnect',
    src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3', // Female
    rating: 4,
  },
  {
    quote:
      'Starting with the free plan was a no-brainer. After experiencing how robust the chatbot is, upgrading to the Plus plan was an easy decision. #FlexiblePlans #ValueForMoney',
    name: 'Liam Peterson',
    designation: 'Director of Growth at ScaleFast',
    src: 'https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3', // Male
    rating: 5,
  },
  {
    quote:
      'Leveraging the OpenAI integration has taken our support system to the next level. The chatbot delivers responses that are both relevant and insightful. #OpenAI #NextLevelSupport',
    name: 'Noah Collins',
    designation: 'CTO at AI Boost',
    src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3', // Male
    rating: 5,
  },
  {
    quote:
      "Customizing the chatbot’s personality was a delightful experience. Now it perfectly mirrors our brand's tone and humor, making every interaction enjoyable. #BrandVoice #ChatbotPersonality",
    name: 'Caroline Wang',
    designation: 'Marketing Director at ChatSpark',
    src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3', // Female
    rating: 5,
  },
];

export const customAppearance = {
  layout: {
    logoImageUrl: '/logo.svg', // Your logo (without text)
    logoPlacement: 'inside' as const,
  },
  variables: {
    colorPrimary: '#679289', // Sage color
    colorText: '#071E22', // Peach color
  },
};
