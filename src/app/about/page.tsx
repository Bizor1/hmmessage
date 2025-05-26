import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full">
                <Image
                    src="https://res.cloudinary.com/duhfv8nqy/image/upload/v1747325319/mymessage/favicons/favicon.jpg"
                    alt="MYMESSAGE brand story"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wider">About Us</h1>
                </div>
            </div>

            {/* Mission Statement */}
            <section className="py-20 px-4">
                <div className="container-represent max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-light mb-8">More Than Fashion</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        MyMessage is more than a fashion brand - it&apos;s a personal mission, a voice, a testimony.
                        Every piece we create carries a message of hope, faith, and purpose that transcends trends.
                        Our name reflects a deeper calling: to wear what you believe and share what you stand for.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        Rooted in Christian values, we design with intention - each item crafted to spread the Good News,
                        uplift hearts, and speak life. We believe fashion should inspire, not just impress. That&apos;s why
                        our collections are filled with meaning, encouraging everyone - regardless of background - to live
                        boldly and carry their own message with confidence.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        From our hands to your wardrobe, every design is a statement: this is MyMessage to the world.
                        Join us in wearing faith, living truth, and making the change you want to see.
                    </p>
                </div>
            </section>

            {/* Values Grid */}
            <section className="bg-gray-50 py-20 px-4">
                <div className="container-represent max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-4">Faith</h3>
                            <p className="text-gray-600">
                                Our foundation is built on Christian values,
                                guiding every design and decision we make.
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-4">Purpose</h3>
                            <p className="text-gray-600">
                                Each piece is crafted with intention,
                                designed to inspire and spread the Good News.
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-4">Impact</h3>
                            <p className="text-gray-600">
                                We believe in fashion that makes a difference,
                                encouraging others to live boldly in their faith.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 px-4">
                <div className="container-represent max-w-4xl mx-auto">
                    <h2 className="text-3xl font-light mb-12 text-center">Our Journey</h2>
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="md:w-1/3 text-right">
                                <h3 className="text-xl font-semibold">2023</h3>
                                <p className="text-gray-600">Brand Launch</p>
                            </div>
                            <div className="md:w-2/3">
                                <p className="text-gray-600">
                                    MyMessage debuts with a vision to create faith-inspired
                                    fashion that speaks to hearts and transforms lives.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="md:w-1/3 text-right">
                                <h3 className="text-xl font-semibold">2024</h3>
                                <p className="text-gray-600">Second Collection</p>
                            </div>
                            <div className="md:w-2/3">
                                <p className="text-gray-600">
                                    Launching our Psalm 91 Long Sleeve collection,
                                    deepening our commitment to faith-inspired fashion.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="md:w-1/3 text-right">
                                <h3 className="text-xl font-semibold">2025</h3>
                                <p className="text-gray-600">Innovation & Impact</p>
                            </div>
                            <div className="md:w-2/3">
                                <p className="text-gray-600">
                                    Introducing groundbreaking designs like our Carpenter Shorts,
                                    continuing to blend faith and fashion in innovative ways.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 