"use client";

import path from "path";
import { Banner } from "@/components/Banner";
import {
  PageContainer,
  MainContainer,
  SectionContainer,
  Section,
  Article,
} from "@/components/ContentContainer";

import type { articleElem } from "@/components/ContentContainer";

const base = "/projects/ComputerGraphics/";

const pageContent: articleElem[] = [
  {
    id: "project1",
    content: (
      <div>
        <h2>Project 1: The Rendering Pipeline</h2>
        <p>Transforms, rasterization, anti-aliasing, and texture mapping</p>
      </div>
    ),
    link: path.join(base, "Project1"),
  },
  {
    id: "project2",
    content: (
      <div>
        <h2>Project 2: Bezier Curves and Mesh Operations</h2>
        <p>
          Drawing bezier curves, upsampling meshes, interpolating surface
          normals.
        </p>
      </div>
    ),
    link: path.join(base, "Project2"),
  },
  {
    id: "project3",
    content: (
      <div>
        <h2>Project 3: Ray Tracing and Illumination</h2>
        <p>
          Drawing bezier curves, upsampling meshes, interpolating surface
          normals.
        </p>
      </div>
    ),
    link: path.join(base, "Project3"),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1>Computer Graphics</h1>
      </Banner>

      <PageContainer>
        <MainContainer>
          <SectionContainer>
            {pageContent.map((article) => (
              <Section key={article.id}>
                <Article id={article.id} link={article.link}>
                  {article.content}
                </Article>
              </Section>
            ))}
          </SectionContainer>
        </MainContainer>
      </PageContainer>
    </div>
  );
}
