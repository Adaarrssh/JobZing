import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

import {
  Code2,
  Database,
  PenTool,
  Briefcase,
  Smartphone,
  Shield,
  BrainCircuit,
  Server,
  Globe,
} from "lucide-react";

const categories = [
  {
    title: "Frontend",
    query: "Frontend Developer",
    icon: <Code2 className="w-8 h-8 text-violet-600" />,
  },
  {
    title: "Backend",
    query: "Backend Developer",
    icon: <Database className="w-8 h-8 text-violet-600" />,
  },
  {
    title: "Full Stack",
    query: "Full Stack Developer",
    icon: <Globe className="w-8 h-8 text-violet-600" />,
  },
  {
    title: "UI / UX",
    query: "UI UX Designer",
    icon: <PenTool className="w-8 h-8 text-violet-600" />,
  },
  {
    title: "Data Science",
    query: "Data Scientist",
    icon: <BrainCircuit className="w-8 h-8 text-violet-600" />,
  },
  {
    title: "Cyber Security",
    query: "Cyber Security",
    icon: <Shield className="w-8 h-8 text-violet-600" />,
  },
  {
    title: "DevOps",
    query: "DevOps Engineer",
    icon: <Server className="w-8 h-8 text-violet-600" />,
  },
  {
    title: "Mobile",
    query: "Mobile Developer",
    icon: <Smartphone className="w-8 h-8 text-violet-600" />,
  },
  {
    title: "Business",
    query: "Business Analyst",
    icon: <Briefcase className="w-8 h-8 text-violet-600" />,
  },
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Explore Job Categories
          </h2>

          <p className="text-gray-500 mt-3">
            Find opportunities in your favorite technology and domain.
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {categories.map((category, index) => (
              <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/4">
                <div
                  onClick={() => searchJobHandler(category.query)}
                  className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex justify-center">{category.icon}</div>

                  <h3 className="mt-5 text-lg font-semibold text-center">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-center text-sm text-gray-500">
                    Click to explore jobs
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default CategoryCarousel;
