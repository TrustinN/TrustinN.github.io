import Image from "next/image";
import { Banner } from "@/components/Banner";
import { Sidebar } from "@/components/Sidebar";
import {
  PageContainer,
  MainContainer,
  SectionContainer,
  Section,
  Article,
} from "@/components/ContentContainer";
import type { articleElem } from "@/components/ContentContainer";
import { ImageContainer } from "@/components/ImageContainer";

const pageContent: articleElem[] = [
  {
    id: "Introduction",
    content: (
      <div>
        <h2>Introduction</h2>
        <p>
          I like to spend my time learning new things/solving problems. Other
          than that, maybe hanging out with friends, going on an occasional walk
          and looking around.
        </p>
      </div>
    ),
  },
  {
    id: "Projects",
    content: (
      <div>
        <h2>Projects</h2>
        <p>
          Working on projects is the most enjoyable part of learning, where I
          can best figure out the details. So far, I have dived into graphics
          heavy projects, which are cool to visualize, and more recently,
          front-end related projects such as designing a website.
        </p>
        <p>
          Favorite projects I&apos;ve done include developing this website,
          implementing an RTree, RRT path planning algorithm, and a 3D
          reconstruction algorithm.
        </p>
      </div>
    ),
    link: "/projects",
  },
  {
    id: "Education",
    content: (
      <div>
        <h2>Education</h2>
        <p>
          I started off in math, but decided cs would be more fun, especially
          because of the blend of theory and hands on application that comes
          with a computer science degree.
        </p>
        <p>
          Math courses were very enjoyable to take, as there were often
          cool/powerful ideas and techniques used. Interestingly, many of the
          courses were self-contained and content was built from the ground up.
        </p>
        <p>
          CS courses were much more applied and putting the theory into practice
          was definitely a challenge. It was rewarding to finish a project and
          see the components fit nicely together.
        </p>
        <p>
          On the very applied side of the spectrum is electrical engineering. It
          had some very cool applications, but it I found that higher-level
          programming was more fun.
        </p>
        <p>
          Other courses outside of these topics were a breath of fresh air. I
          particularly found an intro to biology course and french course to be
          engaging and memorable.
        </p>
        <aside>
          <details>
            <summary>Favorite place to study?</summary>
            <p>A corner in Main Stacks 2nd floor</p>
          </details>
          <details>
            <summary>Best scenary?</summary>
            <p>Botanical Garden</p>
            <ImageContainer columns={2}>
              <Image
                src="/media/pond.jpeg"
                alt="botanical garden pond"
                width="4032"
                height="3024"
                loading="lazy"
              />
              <Image
                src="/media/redwood.jpeg"
                alt="botanical garden redwood"
                width="4032"
                height="3024"
                loading="lazy"
              />
            </ImageContainer>
          </details>
        </aside>
      </div>
    ),
    link: "/education",
  },
  {
    id: "Hobbies",
    content: (
      <div>
        <h2>Hobbies</h2>
        <p>
          I grew up most of my life learning the piano, but have taken up other
          things on the side for added fun. Cooking is fun at times, especially
          if I have some free time. For some reason I find baking more
          enjoyable.
        </p>
      </div>
    ),
    link: "/hobbies",
  },
];

export default function Home() {
  return (
    <div>
      <Banner>
        <h1> Trustin Nguyen </h1>
        <p className="text-slate-700">Computer Science / Mathematics Enjoyer</p>
      </Banner>

      <PageContainer>
        <MainContainer>
          <SectionContainer>
            {pageContent.map((article) => (
              <Section key={article.id}>
                <Article id={article.id} link={article.link}>
                  {" "}
                  {article.content}
                </Article>
              </Section>
            ))}
          </SectionContainer>
          <Sidebar ids={pageContent.map((content) => content.id)}>
            {" "}
            <div className="h-auto border-[5px] border-solid border-black rounded-[1rem] bg-white mb-4">
              <Image
                className="rounded-[0.65rem]"
                src="/media/profile.jpg"
                alt="Profile Picture"
                height="3088"
                width="2320"
              />
            </div>{" "}
          </Sidebar>
        </MainContainer>
      </PageContainer>
    </div>
  );
}
