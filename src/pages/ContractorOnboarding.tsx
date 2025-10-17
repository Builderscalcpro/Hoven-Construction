import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OnboardingDashboard from '@/components/onboarding/OnboardingDashboard';
import DocumentCollection from '@/components/onboarding/DocumentCollection';
import BackgroundCheckStatus from '@/components/onboarding/BackgroundCheckStatus';
import InsuranceVerification from '@/components/onboarding/InsuranceVerification';
import SkillAssessment from '@/components/onboarding/SkillAssessment';
import SafetyTraining from '@/components/onboarding/SafetyTraining';

export default function ContractorOnboarding() {
  const { user } = useAuth();
  const [onboarding, setOnboarding] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      initializeOnboarding();
    }
  }, [user]);

  const initializeOnboarding = async () => {
    try {
      // Check if onboarding exists
      let { data: existing } = await supabase
        .from('contractor_onboarding')
        .select('*')
        .eq('contractor_id', user!.id)
        .single();

      if (!existing) {
        // Create new onboarding
        const { data: newOnboarding } = await supabase
          .from('contractor_onboarding')
          .insert({
            contractor_id: user!.id,
            status: 'in_progress',
            current_stage: 'documents'
          })
          .select()
          .single();
        
        existing = newOnboarding;
      }

      setOnboarding(existing);
    } catch (error) {
      console.error('Error initializing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contractor Onboarding</h1>
        <p className="text-muted-foreground">
          Complete all steps to get started with your contractor account
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <OnboardingDashboard contractorId={user!.id} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="mt-6">
              <DocumentCollection 
                contractorId={user!.id} 
                onboardingId={onboarding?.id}
              />
            </TabsContent>

            <TabsContent value="background" className="mt-6">
              <BackgroundCheckStatus 
                contractorId={user!.id}
                onboardingId={onboarding?.id}
              />
            </TabsContent>

            <TabsContent value="insurance" className="mt-6">
              <InsuranceVerification contractorId={user!.id} />
            </TabsContent>

            <TabsContent value="assessment" className="mt-6">
              <SkillAssessment 
                contractorId={user!.id}
                onboardingId={onboarding?.id}
              />
            </TabsContent>

            <TabsContent value="training" className="mt-6">
              <SafetyTraining 
                contractorId={user!.id}
                onboardingId={onboarding?.id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
