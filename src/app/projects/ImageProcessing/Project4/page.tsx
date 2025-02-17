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
import { Sidebar } from "@/components/Sidebar";

import { ImageContainer } from "@/components/ImageContainer";
import Image from "next/image";
import { MathJax } from "better-react-mathjax";

const base = "/projects/ImageProcessing/Project4/";
const mediaBase = path.join(base, "media");

const pageContent: articleElem[] = [
  {
    id: "Homographies",
    content: (
      <div>
        <h2>Recovering the Homographies</h2>
        <p>
          A homography is given by a transformation sending{" "}
          <MathJax inline={true}>
            {"\\(v_{1} = \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix}\\)"}
          </MathJax>{" "}
          to{" "}
          <MathJax inline={true}>
            {
              "\\(v_{2} = \\begin{bmatrix} x^{\\prime} \\\\ y^{\\prime} \\\\ 1 \\end{bmatrix}\\)"
            }
          </MathJax>{" "}
          mod scaling through a matrix:
          <MathJax>
            {
              "\\begin{equation*} c \\begin{bmatrix} x^{\\prime} \\\\ y^{\\prime} \\\\ 1 \\end{bmatrix} = \\begin{bmatrix} h_{1} & h_{2} & h_{3} \\\\ h_{4} & h_{5} & h_{6} \\\\ h_{7} & h_{8} & 1 \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\\\ 1 \\end{bmatrix} \\end{equation*}"
            }
          </MathJax>
          Multiplying everything out, we get:
          <MathJax>
            {
              "\\begin{align*} cx^{\\prime} &= h_{1}x + h_{2}y + h_{3} \\\\ cy^{\\prime} &= h_{4}x + h_{5}y + h_{6} \\\\ c &= h_{7}x + h_{8}y + 1 \\end{align*}"
            }
          </MathJax>
          and substituting:
          <MathJax>
            {
              "\\begin{align*} (h_{7}x + h_{8}y + 1)x^{\\prime} &= h_{1}x + h_{2}y + h_{3} \\\\ (h_{7}x + h_{8}y + 1)y^{\\prime} &= h_{4}x + h_{5}y + h_{6} \\end{align*}"
            }
          </MathJax>
          will give the system of equations:
          <MathJax>
            {
              "\\begin{align*} h_{1}x + h_{2}y + h_{3} + 0h_{4} + 0h_{5} + 0h_{6} - h_{7}xx^{\\prime} - h_{8}yx^{\\prime} - 1x^{\\prime} &= 0 \\\\ 0h_{1} + 0h_{2} + 0h_{3} + h_{4}x + h_{5}y + h_{6} - h_{7}xy^{\\prime} - h_{8}yy^{\\prime} - 1y^{\\prime} &= 0 \\end{align*}"
            }
          </MathJax>
          This gives a way to solve for the entries of the matrix{" "}
          <MathJax inline={true}>{"H"}</MathJax> through a different linear
          equation <MathJax inline={true}>{"\\(Ax = b\\)"}</MathJax> where{" "}
          <MathJax inline={true}>{"\\(A\\)"} </MathJax> is a{" "}
          <MathJax inline={true}>{"\\(2 \\times 8\\)"}</MathJax> matrix,
          <MathJax inline={true}>x </MathJax> is the vector containing the
          entries <MathJax inline={true}>{"\\(h_1, \\ldots, h_8\\)"}</MathJax>,
          and <MathJax inline={true}>{"\\(b\\)"}</MathJax> is the vector
          containing the values{" "}
          <MathJax inline={true}>{"\\(x', y'\\)"}</MathJax>. This is extendable
          to include more points in our homography mapping and can be solved
          through least squares to find the projective mapping
        </p>
        <p>
          Here is an example of the point correspondences that I used to compute
          the homography
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part1/kps1.png")}
            alt="kps1"
            width="913"
            height="325"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Image Warping",
    content: (
      <div>
        <h2>Warping the Image</h2>
        <p>
          This process was very similar to the last project, but instead, the
          warp would be determined by four corners under the homography
          transformation. After calculating the new corners, a resulting image
          would be set to encompass the warped image. The pixel values in the
          new image <MathJax inline={true}>{"\\(B\\)"}</MathJax> would be
          determined by where the pixel landed under the transformation{" "}
          <MathJax inline={true}>{"\\(H^{-1}\\)"}</MathJax>
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part1/inverseWarp.svg")}
            alt="inverseWarp"
            width="560"
            height="380"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          Since the pixel location under $H^{-1}$ is not exact, I used griddata
          to interpolate for the pixel value using the location and values in
          the original image as the data. Here is the result of the warp on the
          left and the base image of the panorama on the right
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part1/homography1.png")}
            alt="homography1"
            width="900"
            height="370"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },

  {
    id: "Rectification",
    content: (
      <div>
        <h2>Rectification</h2>
        <p>
          One interesting application of image warping by homography is to
          emulate a snapshot of the image from a different perspective. In
          changing the camera angle via homography, we attempt to capture the
          pixels outside the image, and therefore, the image is shifted further
          to the peripheral making it seem distorted. This is why rectification
          will work well when dealing with small shifts in the perspective. Here
          are some examples that I ran my code on:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/Part1/rectified/book_original.png")}
            loading="lazy"
            width="950"
            height="640"
            alt="PreRectified book"
          />
          <Image
            src={path.join(mediaBase, "/Part1/rectified/book_rectified.png")}
            loading="lazy"
            width="1600"
            height="1000"
            alt="Rectified book"
          />
          <Image
            src={path.join(mediaBase, "/Part1/rectified/sign_original.png")}
            loading="lazy"
            width="660"
            height="800"
            alt="PreRectified sign"
          />
          <Image
            src={path.join(mediaBase, "/Part1/rectified/sign_rectified.png")}
            loading="lazy"
            width="3200"
            height="1600"
            alt="Rectified Sign"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Image Mosaic",
    content: (
      <div>
        <h2>Image Mosaic</h2>
        <p>
          The first step is to correctly align the images. Here I used zero
          padding:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part1/padded_homography.png")}
            alt="padded_homography"
            width="550"
            height="200"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          The images cannot be directly added together and averaged at the
          intersection because there is different lighting and exposure across
          images. To fix this, I created a set of two images. Let the image on
          the left be image <MathJax inline={true}>{"\\(A\\)"}</MathJax> and the
          image on the right be image{" "}
          <MathJax inline={true}>{"\\(B\\)"}</MathJax>. In one image, image{" "}
          <MathJax inline={true}>{"\\(A\\)"}</MathJax> would dominate, meaning
          that on{" "}
          <MathJax inline={true}>
            {"\\(\\text{image}(A) \\cap \\text{image} B\\)"}
          </MathJax>
          , I would set the pixel values to be that of image{" "}
          <MathJax inline={true}>{"\\(A\\)"}</MathJax>. The other case would be
          an image where image <MathJax inline={true}>{"\\(B\\)"}</MathJax>{" "}
          dominates. Here is an example of creating these images:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part1/blending/im1dominant.png")}
            width="1000"
            height="250"
            alt="im1dominant"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/Part1/blending/im2dominant.png")}
            alt="im2dominant"
            width="500"
            height="140"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          Then for the blending, notice that image{" "}
          <MathJax inline={true}>{"\\(A\\)"}</MathJax> captures the scene more
          accurately the closer the pixels are to the center of image{" "}
          <MathJax inline={true}>{"\\(A\\)"}</MathJax>. The same goes for image{" "}
          <MathJax inline={true}>{"\\(B\\)"}</MathJax>. So to get a blend, a
          linear interpolation between their centers can be calculated (through
          griddata) and put into a mask. The output image is given by
          <MathJax>
            {
              "\\begin{equation*} \\text{mosaic} = \\text{mask} \\cdot \\text{dominantA} + (1 - \\text{mask}) \\cdot \\text{dominantB} \\end{equation*}"
            }
          </MathJax>
          Here is an iterative approach to the blending:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/Part1/blending/blend0.jpeg")}
            alt="blend0"
            width="430"
            height="560"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/Part1/blending/blend1.jpeg")}
            alt="blend1"
            width="400"
            height="467"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/Part1/blending/blend2.jpeg")}
            alt="blend2"
            width="380"
            height="410"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/Part1/blending/blend3.jpeg")}
            alt="blend3"
            width="480"
            height="480"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          Although it is possible to separate the frequencies into high and low
          frequencies, blending the lower frequencies and choosing one of the
          higher frequencies, I had more success just directly blending the
          images. This is because a small misalignment of about 5 pixels can
          cause the high frequencies in one image to look discontinuous with the
          high frequencies in the other. This caused the railing to look cutoff
          at certain areas in my previous blends. Here is the final result
          without separating the frequencies:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part1/mosaic.png")}
            width="6900"
            height="3000"
            alt="mosaic"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Corner Detection",
    content: (
      <div>
        <h2>Detecting Corner Features</h2>
        <p>
          The Harris corner detector defines a corner centered on pixel{" "}
          <MathJax inline={true}>{"\\(u, v\\)"}</MathJax> on some window of size{" "}
          <MathJax inline={true}>{"\\(w\\)"}</MathJax> if for any shift in{" "}
          <MathJax inline={true}>{"\\(x\\)"}</MathJax> or{" "}
          <MathJax inline={true}>{"\\(y\\)"}</MathJax>, the squared difference
          between the shifted window and the original is non-zero.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part2/harris_corner_def.svg")}
            width="1120"
            height="800"
            alt="harris corner def"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          We notice that when the red window is over a monocolor surface, shifts
          of the window in either the{" "}
          <MathJax inline={true}>{"\\(x\\)"}</MathJax> or{" "}
          <MathJax inline={true}>{"\\(y\\)"}</MathJax> direction results in no
          change in what the window sees. For the line example, the window only
          sees a change when we move in the vertical direction. When the window
          is shifted in a horizontal direction, the difference is{" "}
          <MathJax inline={true}>{"\\(0\\)"}</MathJax>. This would be defined as
          an edge. Finally, we have the vertex of a triangle. In this case, any
          change in either the <MathJax inline={true}>{"\\(x\\)"}</MathJax>
          or <MathJax inline={true}>{"\\(y\\)"}</MathJax> direction results in a
          change in what the window sees. We can also plot the squared
          difference as a function over displacement of the window at a pixel.
          Here&apos;s what it would look like for the above examples:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part2/corner_diff.svg")}
            width="1120"
            height="800"
            alt="window differences"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          The first one is circular because at the origin, displacement is,{" "}
          <MathJax inline={true}>{"\\((0, 0)\\)"}</MathJax> and as we have more
          displacement, the error increases between the original and the
          displaced window. The second one is like a valley because along the
          horizontal direction, displacement does not change what the window
          sees, so the error is <MathJax inline={true}>{"\\(0\\)"}</MathJax>. As
          we move in the vertical direction, the error increase. Finally, if the
          window is over a monocolor surface, the error will be{" "}
          <MathJax inline={true}>{"\\(0\\)"}</MathJax>.
        </p>
        <p>
          Implementation of finding the harris corners and corner strength was
          given as starter code. Also, I was not able to plot all harris corners
          because there were too many detected, and it would completely blanket
          the image. A view of some of the filtered out corners will be shown in
          the next section.
        </p>
      </div>
    ),
  },
  {
    id: "Feature Descriptors",
    content: (
      <div>
        <h2>Extracting Feature Descriptors</h2>
        <p>
          Feature descriptors describe what is happening locally at a pixel.
          They usually small{" "}
          <MathJax inline={true}>{"\\(8 \\times 8\\)"}</MathJax> pixels, and can
          be used to match features across images. This is done by the squared
          difference between the descriptors. At the original resolution,
          however, the descriptors are not robust to small errors such as
          differences in orientation and perspective. To fix this, a{" "}
          <MathJax inline={true}>{"\\(40 \\times 40\\)"}</MathJax> window is
          sampled around the pixel, convolved with a Gaussian kernel, and
          downsampled by <MathJax inline={true}>{"\\(5\\)"}</MathJax>. The
          descriptor is finally normalized to make it resilient to differences
          in luminence:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part2/feat_desc.jpg")}
            width="2300"
            height="900"
            alt="feature descriptor bush"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/Part2/feat_desc2.jpg")}
            alt="feature descriptor building"
            width="800"
            height="2100"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          And here are all the feature descriptors extracted from the images:
        </p>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/Part2/feat_desc_left.jpg")}
            width="1250"
            height="980"
            alt="doe descriptor left"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/Part2/feat_desc_right.jpg")}
            width="1150"
            height="850"
            alt="doe descriptor right"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Feature Matching",
    content: (
      <div>
        <h2>Feature Matching</h2>
        <p>
          Notice that in the previous picture, some feature descriptors in one
          image are not present in the other. So we need a way to throw away
          feature descriptors as well as match the remaining feature
          descriptors. One problem with finding the nearest neighbor from one
          image to another by squared error is that two descriptors could yield
          a small error, but the probability of it being an incorrect match
          shares significant overlap with the probability that it is a correct
          match:
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part2/nn_matching.jpg")}
            width="1850"
            height="850"
            alt="nearest neighbor matching error"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          This is seen on the left where a nearest neighbor squared error of{" "}
          <MathJax inline={true}>{"\\(10\\)"}</MathJax> will not be a strong
          indicator of whether the pair is a correct match or not. One instance
          in which this might be a problem is if the descriptors are not present
          in both images. In the case that the descriptor from one image matches
          with the descriptor in the other, we have an outlier match, which will
          throw off the key point matching.
        </p>
        <p>
          In contrast, we can instead look at the ratio between the closest
          match and the second closest match error. This gives a much better
          separation between the probability density of correct matches vs
          incorrect matches. The algorithm is reduce to setting the threshold.
          If the ratio of the error is high, then we can reject both descriptors
          as being a part of the final match. If the ratio is low, then we have
          found a match between the descriptor and its nearest neighbor.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part2/doe_matching.jpg")}
            width="1900"
            height="780"
            alt="Doe feature matching"
            loading="lazy"
          />
        </ImageContainer>
        <p>
          Here, the white feature descriptors are from before feature matching.
          The red is after feature matching. Notice that the feature descriptors
          that are preserved tend to be on the overlap region of the two images.
        </p>
      </div>
    ),
  },
  {
    id: "Robust Homography",
    content: (
      <div>
        <h2>Robust Homography</h2>
        <p>
          All that is left is to produce the homography. One problem we have is
          that many of the feature descriptors do not represent a true match.
          For example, in the right image below, there is a red feature
          descriptor in the bottom right corner, which clearly lies outside of
          the image on the left. To make the homography robust to incorrect
          matches, we can use the RANSAC method.
        </p>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part2/feat_corres.jpg")}
            width="1800"
            height="700"
            alt="feature correspondences"
            loading="lazy"
          />
        </ImageContainer>

        <p>
          RANSAC is a statistical algorithm which, for a chosen set of data,
          finds the inliers and outliers given our distribution. In our example,
          given four points which define a homography, we want to see how likely
          the homography on these points is to be the true homography. To do
          this, we compute the homography on the four points, and for every
          other point in the same image, we apply the homography. We then see if
          its matching feature descriptor lie within half a pixel of each other.
          If they do, then we classify them as an inlier, meaning they agree
          with the homography, otherwise, they are an outlier. The problem then
          reduces to choosing the homography that maximizes the number of
          inliers.
        </p>
        <ImageContainer columns={3}>
          <Image
            src={path.join(mediaBase, "/Part2/results/doe/doeleft.jpg")}
            width="1500"
            height="1125"
            alt="doe left"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/Part2/results/doe/doemiddle.jpg")}
            width="1500"
            height="1125"
            alt="doe middle"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/Part2/results/doe/doeright.jpg")}
            width="1500"
            height="1125"
            alt="doe right"
            loading="lazy"
          />
        </ImageContainer>
        <ImageContainer columns={2}>
          <Image
            src={path.join(mediaBase, "/Part2/results/doe/doe1.jpg")}
            width="1690"
            height="1250"
            alt="doe first homography"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/Part2/results/doe/doe2.jpg")}
            width="1900"
            height="1000"
            alt="doe second homography"
            loading="lazy"
          />
        </ImageContainer>
      </div>
    ),
  },
  {
    id: "Final Results",
    content: (
      <div>
        <h2>A Comparison</h2>
        <p>
          Here are the results of the homography done manually vs automatically.
          The image on top will be the one doe manually and the one below is
          automatic. There is a noticeable trend that the automatic alignment
          and robust homography tends to do better in areas that have lots of
          trees. In the examples below, my manual alignment tends to result in
          the leaves being blurred, while the automatic alignment is much more
          consistent in aligning the leaves.
        </p>
        <h4>Near Anthropology</h4>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part2/results/anthro/anthro.jpg")}
            width="3700"
            height="1950"
            alt="anthro manual"
            loading="lazy"
          />
          <Image
            src={path.join(
              mediaBase,
              "/Part2/results/anthro/anthro_ransac.jpg",
            )}
            width="3800"
            height="1950"
            alt="anthro auto"
            loading="lazy"
          />
        </ImageContainer>
        <h4>Street Intersection</h4>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part2/results/intersection/inter.jpg")}
            width="3000"
            height="1600"
            alt="intersection manual"
            loading="lazy"
          />
          <Image
            src={path.join(
              mediaBase,
              "/Part2/results/intersection/inter_ransac.jpg",
            )}
            width="3000"
            height="1600"
            alt="intersection auto"
            loading="lazy"
          />
        </ImageContainer>
        <h4>Faculty Glade</h4>
        <ImageContainer>
          <Image
            src={path.join(mediaBase, "/Part2/results/glade/glade.jpg")}
            width="3000"
            height="1600"
            alt="glade manual"
            loading="lazy"
          />
          <Image
            src={path.join(mediaBase, "/Part2/results/glade/glade_ransac.jpg")}
            width="3500"
            height="1800"
            alt="glade auto"
            loading="lazy"
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
        <h1>Project 4: Image Warping and Mosaicing</h1>
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
