import React from "react";
import { useParams, NavLink } from "react-router-dom";
import "./sectionBar.scss";

const Section = ({ title }) => {
  const { section } = useParams();

  return (
    <NavLink
      to={title}
      className={["section", section === title ? "section-active" : null].join(
        " "
      )}
    >
      {title}
    </NavLink>
  );
};

const SectionBar = () => {
  return (
    <section className="section-bar col-12">
 
      <div className="section-bar-list col-10">
        <Section title="Tdsf" />
        <Section title="Taskdjgfi" />
        <Section title="Tdsfqwe23" />
        <Section title="Tdsf4" />
        <Section title="Taskdjgfi5" />
        <Section title="Tdsfqwe236" />
      </div>
    </section>
  );
};

export default SectionBar;
