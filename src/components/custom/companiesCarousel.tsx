"use client";

import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import companiesData from "@/constants/companies.json";
import Image from "next/image";

const CompaniesCarousel = () => {
    return (
        <section id="features" className="py-20 my-10 dotted-background">
            <div className="container mx-auto">
                <h3 className="text-3xl font-bold mb-12 text-center">
                    Trusted by Industry Leaders
                </h3>

                <Carousel
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                >
                    <CarouselContent className="flex items-center gap-3 py-6">
                        {companiesData.map(({ name, path, id }) => (
                            <CarouselItem
                                key={id}
                                className="basis-1/3 md:basis-1/6"
                            >
                                <Image
                                    src={path}
                                    alt={name}
                                    width={200}
                                    height={56}
                                    className="h-10 sm:h-14 w-auto object-contain mx-auto"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
};

export default CompaniesCarousel;
