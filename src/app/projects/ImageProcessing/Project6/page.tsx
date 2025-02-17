"use client";

import path from "path";
import Image from "next/image";
import { Banner } from "@/components/Banner";
import {
  PageContainer,
  MainContainer,
  SectionContainer,
  Section,
  Article,
} from "@/components/ContentContainer";
import { ImageContainer } from "@/components/ImageContainer";
import type { articleElem } from "@/components/ContentContainer";
import { Sidebar } from "@/components/Sidebar";
import { MathJax } from "better-react-mathjax";

const base = "/projects/ImageProcessing/Project6/";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "Tracking 2D Points",
    content: (
      <div>
        <h2>Tracking 2D Points</h2>
        <p>
          To add objects to a video that seem 3D, we need to establish a
          correspondence between the 2D points in the video with their 3D points
          in world coordinates. To begin, we initalize a tracker for every
          reference point that we set in the first frame of the video:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/tracked.jpg")}
            alt="tracked points"
            width="1440"
            height="820"
          />
        </ImageContainer>
        <p>
          For every point marked, we also instantiate a list of their
          corresponding points in 3D.
        </p>
      </div>
    ),
  },
  {
    id: "Updating Tracked Points",
    content: (
      <div>
        <h2>Updating Tracked Points</h2>
        <p>
          For every frame after the first, we update each tracker and check if
          the previous position has changed significantly. If it has, we set
          that tracker as invalid.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/update.gif")}
            alt="updated points"
            width="320"
            height="180"
          />
        </ImageContainer>
        <p>
          This means for every frame, we have a list of 2D points and their
          corresponding 3D points. We index into each of them by a boolean array
          based on if the points are valid or not.
        </p>
      </div>
    ),
  },
  {
    id: "Camera Calibration",
    content: (
      <div>
        <h2>Camera Calibration</h2>
        <p>
          The mapping of 3D coordinates to points in the image is done by a
          series of two matrices, one of which account for the rotation and
          translation of points in 3D space, and the other based on camera
          intrinsics.
        </p>
        <p>
          Solving for this matrix involves solving for some matrix $M$ which
          minimizes the error of:{" "}
          <MathJax inline={true}>
            {
              "\\begin{equation*} \\begin{bmatrix} mu \\\\ mv \\\\ m \\end{bmatrix} = M \\begin{bmatrix} x \\\\ y \\\\ z \\\\ 1 \\end{bmatrix} \\end{equation*}"
            }
          </MathJax>{" "}
          for every point{" "}
          <MathJax inline={true}>
            {"\\begin{bmatrix} x & y & z \\end{bmatrix}"}
          </MathJax>{" "}
          and its corresponding point{" "}
          <MathJax inline={true}>
            {"\\begin{bmatrix} u & v \\end{bmatrix}"}
          </MathJax>{" "}
          in the image. The calculation is done by least squares since the
          system is over-determined after{" "}
          <MathJax inline={true}>{"\\(6\\)"}</MathJax> points and is very
          similar to the homography matrix calculation.
        </p>
      </div>
    ),
  },
  {
    id: "Adding To the Scene",
    content: (
      <div>
        <h2>Adding To the Scene</h2>
        <p>
          Now that we have the matrix sending 3D points to 2D points in the
          image, we can build structures like a cube:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/axes.gif")}
            alt="axes added"
            width="320"
            height="180"
          />
          <Image
            src={path.join(mediaBase, "/cube.gif")}
            alt="cube added"
            width="320"
            height="180"
          />
        </ImageContainer>
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1>Project 6: Poor Man&apos;s Augemented Reality</h1>
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
          <Sidebar ids={pageContent.map((article) => article.id)} />
        </MainContainer>
      </PageContainer>
    </div>
  );
}
