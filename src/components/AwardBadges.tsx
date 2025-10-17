const AwardBadges = () => {
  const awards = [
    {
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1760204164837_25a00605.png',
      title: 'Angi Super Service Award',
      description: '2023',
      alt: 'Angi Super Service Award 2023'
    },
    {
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1760204165731_bec1a13c.png',
      title: 'Best of BuildZoom',
      description: '2024',
      alt: 'Best of BuildZoom 2024'
    },
    {
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1760204166067_a39182c0.png',
      title: 'HomeAdvisor Elite Service',
      description: 'Elite Service Provider',
      alt: 'HomeAdvisor Elite Service Award'
    },
    {
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1760204166434_d203e4fa.png',
      title: 'Angi Super Service',
      description: '2020',
      alt: 'Angi Super Service Award 2020'
    },
    {
      image: 'https://d64gsuwffb70l.cloudfront.net/6851e91275b884fa54047eb7_1760204302757_e5d429d2.png',
      title: 'EPA Lead-Safe Certified',
      description: 'NAT-F282538-1',
      alt: 'EPA Lead-Safe Certified Firm'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Awards & Recognition</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {awards.map((award, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <img 
                src={award.image} 
                alt={award.alt}
                className="w-24 h-24 object-contain mb-3"
              />
              <h3 className="font-bold text-lg mb-1">{award.title}</h3>
              <p className="text-sm text-gray-600">{award.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardBadges;
