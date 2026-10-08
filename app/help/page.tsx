import type { Metadata } from "next";

export const metadata: Metadata = { title: "Help center" };

const SECTIONS = [
  {
    id: "shipping",
    title: "Shipping",
    items: [
      ["How much does shipping cost?", "Standard shipping is $6.99 and free on orders over $75. Express is $14.99 and Overnight is $24.99."],
      ["When will my order arrive?", "Standard takes 4-6 business days, Express 2 business days and Overnight the next business day. Orders placed before 2pm ship the same day."],
    ],
  },
  {
    id: "returns",
    title: "Returns",
    items: [
      ["What is the return policy?", "Return any unused item within 30 days for a full refund. Returns are free on all orders."],
      ["How do I start a return?", "Go to your account, open the order and choose the item. We'll email you a prepaid label."],
    ],
  },
  {
    id: "payments",
    title: "Payments",
    items: [
      ["Which payment methods do you accept?", "Visa, Mastercard, American Express and cash on delivery. This demo store never charges real money."],
      ["Can I use a promo code?", "Yes. Enter it in the cart or at checkout. Try WELCOME10, SAVE20 (orders over $150) or FREESHIP."],
    ],
  },
  {
    id: "sizing",
    title: "Sizing",
    items: [
      ["How does footwear fit?", "Kinetic shoes run true to size. If you're between sizes, size up for running shoes."],
      ["How does apparel fit?", "Northfold hoodies are relaxed and boxy. Take your usual size for the intended fit, or size down for a closer cut."],
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    items: [
      ["How can I reach support?", "Email support@nexora.example or chat with us 8am-10pm, seven days a week. (Demo contact details.)"],
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">Support</p>
      <h1 className="font-display mt-2 text-4xl font-bold sm:text-6xl">How can we help?</h1>
      <nav className="mt-8 flex flex-wrap gap-2" aria-label="Help topics">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="rounded-full border border-line px-4 py-2 text-sm hover:border-accent hover:text-accent">{s.title}</a>
        ))}
      </nav>
      <div className="mt-12 space-y-14">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-44">
            <h2 className="font-display mb-4 text-3xl font-bold">{s.title}</h2>
            <div className="space-y-3">
              {s.items.map(([q, a]) => (
                <details key={q} className="group rounded-2xl border border-line bg-surface p-5 open:border-accent/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {q}
                    <span className="text-accent transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-muted">{a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
