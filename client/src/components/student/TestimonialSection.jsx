import React, { useState } from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestimonialsSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleReadMore = (index) => {
    setExpandedIndex(index);
  };

  const handleClose = () => {
    setExpandedIndex(null);
  };

  return (
    <div className="pb-14 px-8 md:px-40 relative">
      <h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>
      <p className="md:text-base text-gray-500 mt-3">
        Hear from our learners as they share their journeys of transformation, success, and how our<br />
        platform has made a difference in their lives.
      </p>

      {/* Testimonial Cards */}
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
                    alt="star"
                  />
                ))}
              </div>
              <p className="text-gray-500 mt-5 line-clamp-4">{testimonial.feedback}</p>
            </div>
            <button
              onClick={() => handleReadMore(index)}
              className="text-blue-500 underline px-5"
            >
              Read more
            </button>
          </div>
        ))}
      </div>

      {/* Expanded Testimonial Modal */}
      {expandedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 relative">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={dummyTestimonial[expandedIndex].image}
                alt={dummyTestimonial[expandedIndex].name}
                className="w-14 h-14 rounded-full"
              />
              <div>
                <h1 className="text-lg font-semibold">{dummyTestimonial[expandedIndex].name}</h1>
                <p className="text-sm text-gray-600">{dummyTestimonial[expandedIndex].role}</p>
              </div>
            </div>
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <img
                  className="h-5"
                  key={i}
                  src={
                    i < Math.floor(dummyTestimonial[expandedIndex].rating)
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="star"
                />
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed">
              {dummyTestimonial[expandedIndex].feedback}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsSection;
