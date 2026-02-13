import React from "react";

const NewsLogo = () => {
  return (
    <section className="bg-gradient-to-r from-[#0b3b2e] via-[#145c3b] to-[#0b3b2e] text-white">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-10">
        <p className="uppercase tracking-[0.2em] text-white/80 text-xs md:text-sm mb-1">
          Официальный сайт
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
          Челябинский городской Совет ветеранов
        </h1>
        <p className="mt-3 text-white/90 text-sm md:text-base max-w-2xl">
          Поддержка ветеранов, сохранение исторической памяти и развитие гражданского общества в Челябинске.
        </p>
      </div>
    </section>
  );
};

export default NewsLogo;