import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { MapPin } from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import PortfolioSEO from './PortfolioSEO';

const ProjectGallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { kitchens, bathrooms, adus, outdoor, loading } = usePortfolioData();


  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }


  return (
    <>
      <PortfolioSEO category="kitchens" projects={[...kitchens, ...bathrooms, ...adus, ...outdoor]} />
      <div className="bg-gray-50">
      {/* Kitchen Section */}

      <section id="kitchens" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Kitchen Remodeling Projects</h2>
          <p className="text-center text-gray-600 mb-12">We're so proud of our work, we have a professional photographer on staff to take photos of our completed jobs (with your permission, of course)</p>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {kitchens.map((project) => (
              <div key={project.id} onClick={() => setSelectedImage(project.image)} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
                <img src={project.image} alt={project.title} className="w-full h-64 object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-4">
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center gap-1 text-white text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bathroom Section */}
      <section id="bathrooms" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Bathroom Renovation Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bathrooms.map((project) => (
              <div key={project.id} onClick={() => setSelectedImage(project.image)} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
                <img src={project.image} alt={project.title} className="w-full h-64 object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-4">
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center gap-1 text-white text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADU Section */}
      <section id="adus" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">ADU Construction Projects</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {adus.map((project) => (
              <div key={project.id} onClick={() => setSelectedImage(project.image)} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
                <img src={project.image} alt={project.title} className="w-full h-64 object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-4">
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center gap-1 text-white text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outdoor Section */}
      <section id="outdoor" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Outdoor Living Projects</h2>
          <p className="text-center text-gray-600 mb-12">Beautiful decks, pergolas, and outdoor spaces in LA</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {outdoor.map((project) => (
              <div key={project.id} onClick={() => setSelectedImage(project.image)} className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg">
                <img src={project.image} alt={project.title} className="w-full h-64 object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-4">
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center gap-1 text-white text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{project.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <VisuallyHidden>
            <DialogTitle>Project Image</DialogTitle>
          </VisuallyHidden>
          {selectedImage && <img src={selectedImage} alt="Project" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
};

export default ProjectGallery;
