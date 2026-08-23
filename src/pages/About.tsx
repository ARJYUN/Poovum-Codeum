export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-dark mb-4">About Onam</h1>
        <p className="text-xl text-accent-brown">The festival of flowers, unity, and harvest.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card-surface p-8">
          <h2 className="text-2xl font-display font-bold text-primary-dark mb-4 border-b border-primary-green/20 pb-2">What is Onam?</h2>
          <p className="text-accent-brown/80 leading-relaxed">
            Onam is the most celebrated festival of Kerala, India. It is a harvest festival that commemorates King Mahabali, whose spirit is said to visit Kerala at the time of Onam. The festival falls in the Malayalam calendar month of Chingam, which overlaps with August–September.
          </p>
        </div>
        
        <div className="card-surface p-8">
          <h2 className="text-2xl font-display font-bold text-primary-dark mb-4 border-b border-primary-green/20 pb-2">What is Pookalam?</h2>
          <p className="text-accent-brown/80 leading-relaxed">
            A Pookalam is a floral carpet designed to welcome King Mahabali. Traditionally made of fresh flowers and leaves, it is laid at the entrance of homes. Creating a Pookalam is a collaborative effort involving family members, and the designs can range from simple concentric circles to complex geometric patterns and cultural motifs.
          </p>
        </div>
      </div>
    </div>
  );
}
