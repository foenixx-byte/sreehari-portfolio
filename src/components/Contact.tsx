import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { services } from "../data";

const projectTypes = [...services.map((service) => service.title), "Something else"];

export default function Contact({ inquiry }: { inquiry: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState(inquiry || projectTypes[0]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setProject(inquiry || projectTypes[0]);
  }, [inquiry]);

  const prepareEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`${project} enquiry from ${name}`);
    const body = encodeURIComponent(
      `Hi Sreehari,\n\n${message}\n\nProject type: ${project}\nFrom: ${name}\nReply to: ${email}`,
    );
    window.location.href = `mailto:sreeharip209@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-b-title">
      <div className="section-heading" data-reveal>
        <h2 id="contact-b-title">(Contact)</h2>
      </div>
      <div className="contact-b-grid">
        <div className="contact-b-intro" data-reveal>
          <h3>Have an idea?<br />Let&apos;s make it <em>useful.</em></h3>
          <p>Tell me what you&apos;re making, where you are in the process and what you need help with. A few clear lines are enough to start.</p>
          <div className="contact-b-details micro">
            <div><span>Email</span><a href="mailto:sreeharip209@gmail.com">sreeharip209@gmail.com↗</a></div>
            <div><span>Based in</span><p>Kerala, India / Working remotely</p></div>
            <div><span>Focus</span><p>Websites, Django apps, APIs & automation</p></div>
          </div>
        </div>

        <form className="contact-form" onSubmit={prepareEmail} data-reveal>
          <div className="form-row">
            <label>
              <span className="micro">Your name</span>
              <input type="text" name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="How should I address you?" />
            </label>
            <label>
              <span className="micro">Email address</span>
              <input type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" />
            </label>
          </div>
          <label>
            <span className="micro">What do you need?</span>
            <select name="project" value={project} onChange={(event) => setProject(event.target.value)}>
              {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>
            <span className="micro">What are you making?</span>
            <textarea name="message" required rows={5} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="A short outline of the project, the problem and what you need..." />
          </label>
          <div className="form-submit">
            <button className="form-button jelly-control" type="submit">Prepare email <span>↗</span></button>
            <p className="micro">Opens your email app with this message filled in. Nothing is stored on this site.</p>
          </div>
        </form>
      </div>
    </section>
  );
}
