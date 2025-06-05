import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialsSection = () => {
  return (
    <div className="pb-14 px-8 md:px-40">
      <h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>
      <p className="md:text-base text-gray-500 mt-3">
        Hear from our learners as they share their journeys of transformation, success, and how our<br />
platform has made a difference in their lives.
      </p>
<div className="flex justify-center gap-6 flex-wrap my-10 md:my-16 px-4">
  {dummyTestimonial.map((testimonial, index) => (
    <div
      key={index}
      className="w-full sm:w-[300px] text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden"
    >
      <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h1>{testimonial.name}</h1>
          <p>{testimonial.role}</p>
        </div>
      </div>
      <div className="p-5 pb-7">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <img
              className="h-5"
              key={i}
              src={
                i < Math.floor(testimonial.rating)
                  ? assets.star
                  : assets.star_blank
              }
            />
          ))}
        </div>
        <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
      </div>
      <a href="" className="text-blue-500 underline px-5">Read more</a>
    </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;