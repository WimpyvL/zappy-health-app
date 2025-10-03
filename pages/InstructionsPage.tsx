import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import { ProgramContext } from '../App';
import { useHomePageData } from '../hooks/useHomePageData';
import { InformationCircleIcon } from '../constants';

interface InstructionSection {
  title: string;
  content: string[];
}

interface MedicationInstructions {
  [key: string]: {
    title: string;
    description: string;
    dosage: string;
    timing: string;
    sections: InstructionSection[];
    warnings: string[];
    tips: string[];
  };
}

const MEDICATION_INSTRUCTIONS: MedicationInstructions = {
  weight: {
    title: 'Weight Loss Medication Instructions',
    description: 'Your prescribed weight loss medication helps reduce appetite and support your weight management journey.',
    dosage: '1 injection per week',
    timing: 'Same day each week, preferably in the morning',
    sections: [
      {
        title: 'How to Administer',
        content: [
          'Wash your hands thoroughly with soap and water',
          'Clean the injection site with an alcohol swab',
          'Remove the cap from the pen and check the medication is clear',
          'Pinch the skin and insert the needle at a 90-degree angle',
          'Press the button and hold for 5 seconds',
          'Remove the needle and dispose of it in a sharps container'
        ]
      },
      {
        title: 'Injection Sites',
        content: [
          'Abdomen (avoid 2 inches around belly button)',
          'Front of thighs',
          'Upper arms (if someone else is injecting)',
          'Rotate injection sites each week'
        ]
      },
      {
        title: 'Storage',
        content: [
          'Store in refrigerator between 36°F to 46°F (2°C to 8°C)',
          'Do not freeze',
          'Keep away from direct light',
          'Can be kept at room temperature (up to 86°F/30°C) for up to 28 days'
        ]
      }
    ],
    warnings: [
      'Do not use if you have a personal or family history of medullary thyroid cancer',
      'Stop taking if you experience severe abdominal pain',
      'Contact your provider if you have signs of pancreatitis',
      'May cause nausea, especially when starting - this usually improves'
    ],
    tips: [
      'Take with or without food',
      'Stay well hydrated',
      'Start with smaller meals',
      'Set a weekly reminder for your injection day'
    ]
  },
  hair: {
    title: 'Hair Loss Treatment Instructions',
    description: 'Your prescribed hair loss treatment helps promote hair growth and prevent further hair loss.',
    dosage: '1 tablet daily OR topical solution twice daily',
    timing: 'Same time each day for best results',
    sections: [
      {
        title: 'How to Take (Oral)',
        content: [
          'Take tablet with a full glass of water',
          'Can be taken with or without food',
          'Swallow whole - do not crush or chew',
          'If you miss a dose, take it as soon as you remember'
        ]
      },
      {
        title: 'How to Apply (Topical)',
        content: [
          'Apply to dry scalp twice daily (morning and evening)',
          'Part hair to expose scalp',
          'Apply 1ml of solution to affected areas',
          'Massage gently into scalp',
          'Wash hands after application',
          'Allow to dry completely (2-4 hours) before sleeping'
        ]
      },
      {
        title: 'Expected Timeline',
        content: [
          'Initial shedding may occur in first 2-4 weeks (this is normal)',
          'New growth typically visible after 3-4 months',
          'Maximum results seen after 6-12 months',
          'Continued use required to maintain results'
        ]
      }
    ],
    warnings: [
      'Women who are pregnant or planning to become pregnant should not handle crushed tablets',
      'May cause temporary scalp irritation',
      'Avoid contact with eyes',
      'Consult provider if you experience chest pain or rapid heartbeat'
    ],
    tips: [
      'Take photos monthly to track progress',
      'Be patient - results take time',
      'Maintain consistent use',
      'Use gentle hair care products'
    ]
  },
  aging: {
    title: 'Anti-Aging Treatment Instructions',
    description: 'Your anti-aging protocol includes medications and treatments to support skin health and reduce visible signs of aging.',
    dosage: 'Varies by specific treatment',
    timing: 'Follow specific schedule for each component',
    sections: [
      {
        title: 'Daily Skincare Routine',
        content: [
          'Morning: Cleanse, apply serum, moisturize, sunscreen (SPF 30+)',
          'Evening: Cleanse, apply tretinoin or retinol, moisturize',
          'Wait 20-30 minutes between products',
          'Start slowly with active ingredients (2-3x per week)'
        ]
      },
      {
        title: 'Application Tips',
        content: [
          'Use pea-sized amount of tretinoin for entire face',
          'Apply to clean, completely dry skin',
          'Avoid eye area, nostrils, and corners of mouth',
          'May cause initial dryness and peeling (normal adjustment)'
        ]
      },
      {
        title: 'Sun Protection',
        content: [
          'Apply broad-spectrum SPF 30+ daily',
          'Reapply every 2 hours when outdoors',
          'Wear protective clothing and hats',
          'Seek shade during peak sun hours (10am-4pm)'
        ]
      }
    ],
    warnings: [
      'Do not use if pregnant or breastfeeding',
      'Increased sun sensitivity - use sunscreen daily',
      'May experience "retinoid uglies" (temporary purging)',
      'Discontinue if severe irritation occurs'
    ],
    tips: [
      'Start slow and build tolerance',
      'Use gentle, fragrance-free products',
      'Keep skin moisturized',
      'Take progress photos in same lighting monthly'
    ]
  },
  peptides: {
    title: 'Peptide Therapy Instructions',
    description: 'Your peptide therapy supports recovery, performance, and overall wellness optimization.',
    dosage: 'As prescribed by your provider',
    timing: 'Typically once or twice daily',
    sections: [
      {
        title: 'Reconstitution (if applicable)',
        content: [
          'Wash hands thoroughly',
          'Clean vial tops with alcohol swabs',
          'Draw bacteriostatic water into syringe',
          'Slowly inject water down side of peptide vial',
          'Gently swirl (do not shake)',
          'Allow to dissolve completely before use'
        ]
      },
      {
        title: 'Administration',
        content: [
          'Subcutaneous injection into fat tissue',
          'Clean injection site with alcohol swab',
          'Pinch skin and insert at 45-90 degree angle',
          'Inject slowly and steadily',
          'Rotate injection sites'
        ]
      },
      {
        title: 'Storage',
        content: [
          'Store unmixed peptides in freezer',
          'Store reconstituted peptides in refrigerator',
          'Use reconstituted peptides within 30 days',
          'Protect from light'
        ]
      }
    ],
    warnings: [
      'Must be prescribed by licensed healthcare provider',
      'Follow exact dosing instructions',
      'Report any unusual side effects',
      'Keep all medications away from children'
    ],
    tips: [
      'Take on empty stomach when possible',
      'Maintain consistent timing',
      'Track your results and how you feel',
      'Stay hydrated'
    ]
  },
  ed: {
    title: 'ED Treatment Instructions',
    description: 'Your prescribed ED medication helps improve erectile function and sexual performance.',
    dosage: 'As needed, typically 30-60 minutes before activity',
    timing: 'Do not take more than once per day',
    sections: [
      {
        title: 'How to Take',
        content: [
          'Take tablet 30-60 minutes before sexual activity',
          'Swallow whole with water',
          'Can be taken with or without food',
          'High-fat meals may delay effectiveness',
          'Sexual stimulation is still required'
        ]
      },
      {
        title: 'Effectiveness',
        content: [
          'Typically works within 30-60 minutes',
          'Effects can last 4-6 hours (varies by medication)',
          'May take 2-3 attempts to find optimal timing',
          'Do not exceed recommended dose'
        ]
      },
      {
        title: 'What to Expect',
        content: [
          'Does not cause spontaneous erections',
          'Requires sexual arousal',
          'May have different response on first use',
          'Effectiveness improves with continued use'
        ]
      }
    ],
    warnings: [
      'Do not take with nitrates (can cause dangerous drop in blood pressure)',
      'Seek immediate medical attention if erection lasts more than 4 hours',
      'Do not take if you have severe heart or liver problems',
      'May cause headache, flushing, or upset stomach'
    ],
    tips: [
      'Avoid excessive alcohol',
      'Reduce stress and anxiety',
      'Communicate with your partner',
      'Report any vision changes immediately'
    ]
  },
  sleep: {
    title: 'Sleep Medication Instructions',
    description: 'Your prescribed sleep medication helps improve sleep quality and duration.',
    dosage: '1 tablet 30 minutes before bedtime',
    timing: 'Only when you can dedicate 7-8 hours to sleep',
    sections: [
      {
        title: 'How to Take',
        content: [
          'Take 30 minutes before intended sleep time',
          'Take only when you can dedicate 7-8 hours to sleep',
          'Swallow whole with water',
          'Take on empty stomach for faster effect',
          'Get into bed soon after taking'
        ]
      },
      {
        title: 'Sleep Hygiene',
        content: [
          'Keep bedroom cool, dark, and quiet',
          'Avoid screens 1 hour before bed',
          'Establish consistent sleep schedule',
          'Avoid caffeine after 2pm',
          'Create relaxing bedtime routine'
        ]
      },
      {
        title: 'Duration of Use',
        content: [
          'Typically prescribed for short-term use (2-4 weeks)',
          'Work with provider to address underlying causes',
          'May need gradual tapering to discontinue',
          'Focus on developing good sleep habits'
        ]
      }
    ],
    warnings: [
      'May cause drowsiness - do not drive or operate machinery',
      'Avoid alcohol while taking',
      'May cause morning grogginess',
      'Can be habit-forming - use as directed'
    ],
    tips: [
      'Only take when you can sleep full night',
      'Practice good sleep hygiene',
      'Keep sleep diary',
      'Address stress and anxiety'
    ]
  },
  women: {
    title: 'Women\'s Health Medication Instructions',
    description: 'Your prescribed hormone therapy helps balance hormones and support overall wellness.',
    dosage: 'As prescribed by your provider',
    timing: 'Typically daily or as directed',
    sections: [
      {
        title: 'How to Take',
        content: [
          'Take at same time each day',
          'Can be taken with or without food',
          'Swallow whole with water',
          'Set daily reminder for consistency',
          'Do not skip doses'
        ]
      },
      {
        title: 'What to Expect',
        content: [
          'May take 2-4 weeks to notice effects',
          'Symptoms gradually improve over time',
          'Regular follow-ups to monitor levels',
          'Dosage may be adjusted based on response'
        ]
      },
      {
        title: 'Monitoring',
        content: [
          'Track symptoms in journal',
          'Note any side effects',
          'Regular lab work as scheduled',
          'Report significant changes to provider'
        ]
      }
    ],
    warnings: [
      'Do not take if pregnant or breastfeeding',
      'Inform provider of all medications',
      'Report unusual bleeding',
      'May increase risk of blood clots'
    ],
    tips: [
      'Be patient - results take time',
      'Maintain healthy lifestyle',
      'Stay consistent with medication',
      'Communicate with your provider'
    ]
  }
};

const InstructionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const { data: homeData } = useHomePageData();

  const safeData = homeData || {
    profile: { first_name: 'User', id: '', user_id: '', last_name: '', date_of_birth: '', weight: 0, height: 0, created_at: '', updated_at: '' }
  };

  const instructions = type ? MEDICATION_INSTRUCTIONS[type] : null;

  if (!instructions) {
    return (
      <div className="flex flex-col flex-grow">
        <Header userName={safeData.profile.first_name} showNotificationBell={true} />
        <main className="px-6 pt-5 pb-24 flex-grow" role="main">
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Instructions not found for this medication type.</p>
            <button
              onClick={() => navigate('/')}
              className="cta-primary"
            >
              Return to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-grow bg-gray-50">
      <Header userName={safeData.profile.first_name} showNotificationBell={true} />

      <main className="px-6 pt-5 pb-24 flex-grow" role="main">
        <button
          onClick={() => navigate('/')}
          className="text-[var(--primary)] hover:text-[var(--secondary)] flex items-center mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{instructions.title}</h1>
          <p className="text-gray-600 mb-4">{instructions.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 rounded-lg p-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Dosage</p>
              <p className="text-gray-900">{instructions.dosage}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Timing</p>
              <p className="text-gray-900">{instructions.timing}</p>
            </div>
          </div>
        </div>

        {instructions.sections.map((section, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <ol className="list-decimal list-inside space-y-2">
              {section.content.map((item, itemIndex) => (
                <li key={itemIndex} className="text-gray-700">{item}</li>
              ))}
            </ol>
          </div>
        ))}

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-4">
          <div className="flex items-start mb-3">
            <InformationCircleIcon className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-red-900 mb-3">Important Warnings</h2>
              <ul className="space-y-2">
                {instructions.warnings.map((warning, index) => (
                  <li key={index} className="text-red-800 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
          <h2 className="text-xl font-bold text-green-900 mb-3">Helpful Tips</h2>
          <ul className="space-y-2">
            {instructions.tips.map((tip, index) => (
              <li key={index} className="text-green-800 flex items-start">
                <span className="mr-2">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Questions or Concerns?</h3>
          <p className="text-blue-800 mb-4">
            If you have any questions about your medication or experience unexpected side effects, please contact your healthcare provider.
          </p>
          <button
            onClick={() => navigate('/messages')}
            className="cta-primary w-full"
          >
            Message Your Care Team
          </button>
        </div>
      </main>
    </div>
  );
};

export default InstructionsPage;
