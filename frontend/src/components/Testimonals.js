import React, { useEffect } from 'react';
import KeenSlider from 'keen-slider';
import 'keen-slider/keen-slider.min.css';
const TestimonialSlider = () => {
  useEffect(() => {
    const keenSlider = new KeenSlider(
      '#keen-slider',
      {
        loop: true,
        slides: {
          origin: 'center',
          perView: 1.25,
          spacing: 16,
        },
        breakpoints: {
          '(min-width: 1024px)': {
            slides: {
              origin: 'auto',
              perView: 1.5,
              spacing: 32,
            },
          },
        },
      },
      []
    );

    const keenSliderPrevious = document.getElementById('keen-slider-previous');
    const keenSliderNext = document.getElementById('keen-slider-next');
    const keenSliderPreviousDesktop = document.getElementById('keen-slider-previous-desktop');
    const keenSliderNextDesktop = document.getElementById('keen-slider-next-desktop');

    keenSliderPrevious.addEventListener('click', () => keenSlider.prev());
    keenSliderNext.addEventListener('click', () => keenSlider.next());
    keenSliderPreviousDesktop.addEventListener('click', () => keenSlider.prev());
    keenSliderNextDesktop.addEventListener('click', () => keenSlider.next());

    return () => {
      keenSlider.destroy();
    };
  }, []);

  return (
    <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="mx-auto max-w-[1340px] px-4 py-12 sm:px-6 lg:me-0 lg:py-16 lg:ps-8 lg:pe-0 xl:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-center lg:gap-16">
          <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What Our Users Say
            </h2>

            <p className="mt-4 text-gray-300">
              Discover how our expense tracker has helped users save money and manage their finances better!
            </p>

            <div className="hidden lg:mt-8 lg:flex lg:gap-4">
              <button
                aria-label="Previous slide"
                id="keen-slider-previous-desktop"
                className="rounded-full border border-blue-600 p-3 text-blue-600 transition hover:bg-blue-600 hover:text-white"
              >
                &#10094;
              </button>

              <button
                aria-label="Next slide"
                id="keen-slider-next-desktop"
                className="rounded-full border border-blue-600 p-3 text-blue-600 transition hover:bg-blue-600 hover:text-white"
              >
                &#10095;
              </button>
            </div>
          </div>

          <div className="-mx-6 lg:col-span-2 lg:mx-0">
            <div id="keen-slider" className="keen-slider">
              {/* Testimonial 1 */}
              <div className="keen-slider__slide">
                <blockquote className="flex h-full flex-col justify-between bg-gray-800 p-6 shadow-xs sm:p-8 lg:p-12 rounded-lg">
                  <div>
                    <div className="flex gap-0.5 text-green-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="text-2xl font-bold text-blue-600 sm:text-3xl">
                        "Best budgeting tool ever!"
                      </p>

                      <p className="mt-4 leading-relaxed text-gray-300">
                        "This expense tracker has changed the way I handle my finances. I can now track my expenses in real time and save more!"
                      </p>
                    </div>
                  </div>

                  <footer className="mt-4 text-sm font-medium text-gray-300 sm:mt-6">
                    &mdash; Alex Johnson
                  </footer>
                </blockquote>
              </div>

              {/* Testimonial 2 */}
              <div className="keen-slider__slide">
                <blockquote className="flex h-full flex-col justify-between bg-gray-800 p-6 shadow-xs sm:p-8 lg:p-12 rounded-lg">
                  <div>
                    <div className="flex gap-0.5 text-green-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="text-2xl font-bold text-blue-600 sm:text-3xl">
                        "Helped me save 20% more!"
                      </p>

                      <p className="mt-4 leading-relaxed text-gray-300">
                        "Tracking every dollar helped me realize where I was overspending. This app has helped me save over 20% on unnecessary expenses!"
                      </p>
                    </div>
                  </div>

                  <footer className="mt-4 text-sm font-medium text-gray-300 sm:mt-6">
                    &mdash; Sarah Williams
                  </footer>
                </blockquote>
              </div>

              {/* Testimonial 3 */}
              <div className="keen-slider__slide">
                <blockquote className="flex h-full flex-col justify-between bg-gray-800 p-6 shadow-xs sm:p-8 lg:p-12 rounded-lg">
                  <div>
                    <div className="flex gap-0.5 text-green-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>

                    <div className="mt-4">
                      <p className="text-2xl font-bold text-blue-600 sm:text-3xl">
                        "User-friendly and powerful!"
                      </p>

                      <p className="mt-4 leading-relaxed text-gray-300">
                        "I love how easy it is to use. The analytics give me a clear picture of where my money goes each month."
                      </p>
                    </div>
                  </div>

                  <footer className="mt-4 text-sm font-medium text-gray-300 sm:mt-6">
                    &mdash; Daniel Carter
                  </footer>
                </blockquote>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="mt-8 flex justify-center gap-4 lg:hidden">
              <button
                aria-label="Previous slide"
                id="keen-slider-previous"
                className="rounded-full border border-blue-600 p-3 text-blue-600 transition hover:bg-blue-600 hover:text-white"
              >
                &#10094;
              </button>

              <button
                aria-label="Next slide"
                id="keen-slider-next"
                className="rounded-full border border-blue-600 p-3 text-blue-600 transition hover:bg-blue-600 hover:text-white"
              >
                &#10095;
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
