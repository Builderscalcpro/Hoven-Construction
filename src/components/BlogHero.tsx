import { BookOpen, TrendingUp, Users } from 'lucide-react';

export default function BlogHero() {
  return (
    <div className="relative bg-gradient-to-br from-amber-600 via-amber-500 to-orange-600 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1760723013507_07ddccd9.webp"
          alt="Construction Blog"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <BookOpen className="h-5 w-5" />
            <span className="font-medium">Expert Construction Insights</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Construction Blog & Resources
          </h1>
          
          <p className="text-xl sm:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Expert tips, renovation guides, and industry insights from LA's premier remodeling contractor
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">20+</div>
              <div className="text-white/80">Expert Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-white/80">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">15+</div>
              <div className="text-white/80">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
