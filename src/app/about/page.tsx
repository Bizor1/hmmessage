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
                    <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wider">Our Story</h1>
                </div>
            </div>

            {/* Mission Statement */}
            <section className="py-20 px-4">
                <div className="container-represent max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-light mb-8">Redefining Modern Expression</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-12">
                        MYMESSAGE was born from a vision to create clothing that speaks without words.
                        We believe in the power of personal style as a form of self-expression,
                        where each piece tells a story and every collection opens a new chapter.
                    </p>
                </div>
            </section>

            {/* Values Grid */}
            <section className="bg-gray-50 py-20 px-4">
                <div className="container-represent max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-4">Sustainability</h3>
                            <p className="text-gray-600">
                                Our commitment to the environment drives every decision,
                                from material selection to packaging solutions.
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                            <p className="text-gray-600">
                                We push boundaries in design and technology to create
                                clothing that meets the demands of modern life.
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold mb-4">Community</h3>
                            <p className="text-gray-600">
                                We&apos;re building more than a brand - we&apos;re creating a
                                community of individuals who share our passion.
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
                                    MYMESSAGE debuts with its first collection,
                                    introducing our unique vision to the world.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="md:w-1/3 text-right">
                                <h3 className="text-xl font-semibold">2024</h3>
                                <p className="text-gray-600">Global Expansion</p>
                            </div>
                            <div className="md:w-2/3">
                                <p className="text-gray-600">
                                    Opening our first flagship stores and expanding
                                    our presence across major fashion capitals.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="md:w-1/3 text-right">
                                <h3 className="text-xl font-semibold">2025</h3>
                                <p className="text-gray-600">Innovation Hub</p>
                            </div>
                            <div className="md:w-2/3">
                                <p className="text-gray-600">
                                    Launching our innovation center, focusing on
                                    sustainable materials and future fashion technologies.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 