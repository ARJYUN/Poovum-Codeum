import { useStore } from '../store/useStore';

export default function Gallery() {
  const designs = useStore(state => state.galleryDesigns);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-primary-dark mb-2">Gallery</h1>
          <p className="text-accent-brown">Discover beautiful Pookalams created by the community.</p>
        </div>
        <div className="hidden md:flex gap-2">
          {['Trending', 'Latest', 'Traditional', 'Modern', 'Minimal'].map(filter => (
            <button key={filter} className="px-4 py-1.5 rounded-full text-sm font-medium border border-accent-brown/20 text-accent-brown hover:bg-primary-green hover:text-white transition-colors">
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {designs.map(design => (
          <div key={design.id} className="card-surface cursor-pointer group hover:scale-[1.02] transition-transform">
            <div className="aspect-square bg-white/50 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
               <img src={design.image} alt={design.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-primary-dark font-display text-xl">{design.name}</h3>
            <p className="text-sm text-accent-brown mb-2">by {design.creator}</p>
            <div className="flex items-center text-accent-vermilion text-sm font-medium">
              ❤️ {design.likes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
