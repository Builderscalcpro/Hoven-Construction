import { useState, useEffect } from 'react';
import { MapPin, Calendar, DollarSign, TrendingUp, MessageSquare, FileEdit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProjectComments } from '@/components/ProjectComments';
import { ChangeOrderForm } from '@/components/ChangeOrderForm';
import { ChangeOrdersList } from '@/components/ChangeOrdersList';
import { format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  budget: number;
  start_date: string;
  end_date: string;
  description: string;
  location: string;
}

interface Consultation {
  id: string;
  client_name: string;
  consultation_date: string;
  project_type: string;
  project_scope: string;
  budget_range: string;
  property_address: string;
  property_type: string;
  style_preferences: string[];
}

export default function Consultations() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const { data: consultData } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', user?.id)
        .order('consultation_date', { ascending: false });

      const { data: projData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      setConsultations(consultData || []);
      setProjects(projData || []);
      if (consultData && consultData.length > 0) {
        setSelectedConsultation(consultData[0]);
      }
      if (projData && projData.length > 0) {
        setSelectedProject(projData[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <p className="text-gray-600">No projects yet. Book a consultation to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">My Projects</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {consultations.map((consultation) => (
            <Card
              key={consultation.id}
              className={`cursor-pointer transition ${
                selectedConsultation?.id === consultation.id ? 'ring-2 ring-amber-500' : ''
              }`}
              onClick={() => setSelectedConsultation(consultation)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{consultation.project_type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{consultation.property_address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(consultation.consultation_date), 'MMM d, yyyy')}</span>
                  </div>
                  <Badge>{consultation.budget_range}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedConsultation && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="comments">
                <MessageSquare className="w-4 h-4 mr-2" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="changes">
                <FileEdit className="w-4 h-4 mr-2" />
                Change Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Location</h3>
                    <p className="text-gray-700">{selectedConsultation.property_address}</p>
                    <p className="text-sm text-gray-500">{selectedConsultation.property_type}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Project Scope</h3>
                    <p className="text-gray-700">{selectedConsultation.project_scope}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Budget Range</h3>
                    <p className="text-gray-700">{selectedConsultation.budget_range}</p>
                  </div>
                  {selectedConsultation.style_preferences && (
                    <div>
                      <h3 className="font-semibold mb-2">Style Preferences</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedConsultation.style_preferences.map((style, idx) => (
                          <Badge key={idx} variant="outline">{style}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              {selectedProject ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Progress</span>
                        </div>
                        <div className="text-2xl font-bold mb-2">{selectedProject.progress}%</div>
                        <Progress value={selectedProject.progress} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Timeline</span>
                        </div>
                        <div className="text-sm">
                          {format(new Date(selectedProject.start_date), 'MMM d')} - 
                          {format(new Date(selectedProject.end_date), 'MMM d, yyyy')}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">Budget</span>
                        </div>
                        <div className="text-2xl font-bold">${selectedProject.budget.toLocaleString()}</div>
                      </CardContent>
                    </Card>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Badge className="text-lg px-4 py-2">{selectedProject.status}</Badge>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    Project details will appear here once work begins
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="comments">
              {selectedProject ? (
                <ProjectComments projectId={selectedProject.id} />
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    Comments available once project starts
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="changes">
              <div className="space-y-6">
                {selectedProject && (
                  <>
                    <ChangeOrderForm
                      projectId={selectedProject.id}
                      consultationId={selectedConsultation.id}
                      onSuccess={() => {}}
                    />
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Change Order History</h3>
                      <ChangeOrdersList projectId={selectedProject.id} />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
