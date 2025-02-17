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
import { Float } from "@/components/Layouts";
import { Sidebar } from "@/components/Sidebar";

import { ImageContainer } from "@/components/ImageContainer";
import Image from "next/image";
import { MathJax } from "better-react-mathjax";

const base = "/projects/ImageProcessing/Project3/";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "Defining Corresopndences",
    content: (
      <div>
        <h2>Defining Correspondences</h2>
        <p>
          To morph one image to another, I would need to define keypoints in
          both images such that one image&apos;s keypoints map to the other. I
          used python&apos;s ginput function from matplotlib to define the
          keypoints:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/KeyPointsPart1.png")}
            alt="keypoints"
            width="1100"
            height="680"
          />
        </ImageContainer>
        <p>
          In selecting the keypoints, I had to make sure that close keypoints
          were not colinear to ensure that there was a triangulation. Also
          important was ensuring that the resulting triangles well partitioned
          the image such that no two different elements were in the same
          triangle. For example, if a triangle corresponding to the first image
          captured some of the hair and the background while the other did not,
          a fragment of the hair would morph inconsitantly with the rest of the
          hair. Finally, keypoints were set in the corners to ensure that the
          entire image was morphed and not just the head.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/morphDelaunay.png")}
            alt="keypoints"
            width="920"
            height="740"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "The Midway Face",
    content: (
      <div>
        <h2>Computing the Midway Face</h2>
        <div>
          <p>
            To get the midway face, the average of the keypoints were first
            calculated to determine the keypoints on the midway face. Delauney
            triangulation gave triangles that indexed into both the keypoints
            for the midway face along with the keypoints for the two images to
            be morphed. Using this, the affine transformation for mapping the
            midway triangle&apos;s vertices on each of the two image&apos;s
            triangle&apos;s vertices could be computed. This allowed me to pull
            the rgb pixel values from both the source images, interpolated, to
            set in the midway image&apos;s triangle. As for the details of the
            implementation, I created an{" "}
            <code>
              inverseWarp(source, sourceTri, dest, destTri, color=True)
            </code>
            function which uses the pixel values in the source image located at
            the sourceTriangle. Using scipy&apos;s griddata method, I used this
            data to interpolate the values for the destination triangle. With
            skimage&apos;s polygon method, I could get the indices for the
            destination triangle <code>destRR, destCC = polygon(destTri)</code>{" "}
            such that
            <code>dest[destRR, destCC] = res</code>, where
            <code>res</code> is the interpolated data. I used the{" "}
            <code>inverseWarp</code> function over all the simplices in the
            triangulation to get two morphs from the original images to the
            midway face.
          </p>
        </div>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/MidwayFace.png")}
            alt="midwayFace"
            width="640"
            height="480"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Morph Sequence",
    content: (
      <div>
        <h2>The Morph Sequence</h2>
        <Float className="max-w-5xl">
          <ImageContainer>
            <Image
              src={path.join(mediaBase, "/morphSequence.gif")}
              alt="morphSequence"
              width="600"
              height="772"
              loading="lazy"
            />
          </ImageContainer>
        </Float>
        <p>
          All that is left is to calculate frames between image1 and the midway
          face and between the midway face and image2 to get a morph sequence
          from image1 to image2. This was done by first setting the start and
          target images for the current frame such that the current frame&apos;s
          image was somewhere between the start and target images. Then I used
          linear interpolation to determine where the keypoints lie in the
          current frame. This is determined by{" "}
          <MathJax inline={true}>{"\\(warpFrac\\)"}</MathJax> which lies between
          0 and 1, 0 being the start of the morph and 1 being the end. Then the
          current keypoints are given by{" "}
          <MathJax inline={true}>
            {"\\(startKp + warpFrac \\cdot (targetKp - startKp)\\)"}
          </MathJax>{" "}
          if
          <MathJax inline={true}>{"\\(warpFrac < 0.5\\)"}</MathJax>. If{" "}
          <MathJax inline={true}>{"\\(warpFrac > 0.5\\)"}</MathJax>, I used{" "}
          <MathJax inline={true}>{"\\(2 \\cdot warpFrac - 1\\)"}</MathJax>.
          After warping the start and target images to the new keypoints, a
          dissolve fraction was used to determine the blend of the two results
          for the current frame in a similar manner to the warp fraction.
        </p>
      </div>
    ),
  },
  {
    id: "Population Mean Face",
    content: (
      <div>
        <h2>Population Mean Face</h2>
        <p>
          To get the mean face, I used the faces from the FEI database. Getting
          the mean face is adding all the images and dividing by the number of
          images.
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/AverageNeutralFace.png")}
            alt="AverageNeutralFace"
            width="640"
            height="480"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/AverageSmilingFace.png")}
            alt="AverageSmilingFace"
            width="640"
            height="480"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          To morph a given face, <MathJax inline={true}>{"\\(f\\)"}</MathJax>,
          and its keypoints, <MathJax inline={true}>{"\\(f_k\\)"}</MathJax>, to
          the average face, I used the same method for computing the midway
          face. Using the average keypoints computed for the average face, I got
          data for it by interpolating from the data given on the triangles
          <MathJax inline={true}>{"\\(f[f_k[simplex]]\\)"}</MathJax>. Here are
          some results, where the images are shown in pairs. The left image is
          the original and the right is the image morphed to the average:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/SampleMorphedToAvg.png")}
            width="640"
            height="480"
            alt="SampleMorphs"
          />
        </ImageContainer>
        <p>
          Using the annotatations for the image, I labeled my face with
          keypoints in the same order. I noticed that there were some keypoints
          missing for the top of the forehead, so I added them to get more
          accurate results. Here are pictures of my face morphed to the average
          and the average morphed to my face:
        </p>

        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/AvgAndMyFaceKp.png")}
            alt="AverageAnyMyFaceKp"
            width="640"
            height="480"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/NewAvgAndMyFaceKp.png")}
            alt="NewAverageAnyMyFaceKp"
            width="640"
            height="480"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/NewAvgAndMyFaceDelaunay.png")}
            alt="NewAverageAnyMyFaceDelaunay"
            width="640"
            height="480"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/MyFaceAvgMorphs.png")}
            alt="MyFaceAvgMorphs"
            width="640"
            height="480"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Caricature",
    content: (
      <div>
        <h2>Caricature</h2>
        <Float>
          <ImageContainer>
            <Image
              src={path.join(mediaBase, "/Caricature1.png")}
              alt="Caricature1"
              width="640"
              height="480"
              loading="lazy"
            />
          </ImageContainer>
        </Float>
        <p>
          To get a caricature I extrapolated data from the mean. I took a
          difference{" "}
          <MathJax inline={true}>{"\\(myface - mean = diff\\)"}</MathJax> and
          for <MathJax inline={true}>{"\\(alpha < 1\\)"}</MathJax> or{" "}
          <MathJax inline={true}>{"\\(alpha < 0\\)"}</MathJax>, I computed{" "}
          <MathJax inline={true}>
            {"\\(alpha \\cdot mean + (1 - alpha) \\cdot myface\\)"}
          </MathJax>
          .
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div>
      <Banner>
        <h1>Project 3: Face Morphing and Modeling a Photo Collection</h1>
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
