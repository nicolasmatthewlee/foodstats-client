import AppLayout from "./AppLayout";
import BackLink from "components/BackLink";

const About = () => {
  return (
    <AppLayout
      content={
        <div className="space-y-[15px]">
          <BackLink to="/" />
          <p>
            Made by Nicolas Lee, a student at the University of Southern
            California studying Applied and Computational Mathematics.
          </p>
        </div>
      }
    />
  );
};

export default About;
