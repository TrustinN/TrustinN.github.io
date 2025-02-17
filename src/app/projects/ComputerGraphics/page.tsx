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
