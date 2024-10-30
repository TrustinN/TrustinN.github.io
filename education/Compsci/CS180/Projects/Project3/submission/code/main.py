import os
import numpy as np
import skimage.io as skio
from scipy.spatial import Delaunay
from ioHandler import GenerateMorph, ImageMean
from skimage.color import rgb2gray

###############################################################################
# Face Morph                                                                  #
###############################################################################

dataPath = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project3/data/"
img1Name = "george_portrait.jpeg"
img2Name = "me2.jpeg"

p1 = os.path.join(dataPath, img1Name)
p2 = os.path.join(dataPath, img2Name)

gM = GenerateMorph()
img1, img2 = gM.setImages(p1, p2)
kp1, kp2 = gM.getKeyPoints(img1, img2, load=True)
midway, midwayKp, simplices = gM.computeMidwayFaces(img1, img2, kp1, kp2)

gM.visualizeDelauney(img1, img2, kp1, kp2, simplices)
gM.visualizeKeyPoints(img1, img2, kp1, kp2)
gM.visualizeMidwayFace(img1, img2, kp1, kp2)
# gM.generateMorphSequence(img1, img2, kp1, kp2, 45, gM.linear, gM.linear)


###############################################################################
# Image Means                                                                 #
###############################################################################


dataPath1 = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project3/data/frontalimages_spatiallynormalized_part1/"
dataPath2 = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project3/data/frontalimages_spatiallynormalized_part2/"
keyPointsPath = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project3/data/frontalshapes_manuallyannotated_46points/"

iM = ImageMean()
gM = GenerateMorph()

imagesNeutral, imagesSmiling = iM.loadImages(dataPath1, dataPath2)


shape = imagesNeutral[0].shape
corners = [
    [0.00000000, 0.00000000],
    [0.00000000, shape[0]-1],
    [shape[1]-1, 0.00000000],
    [shape[1]-1, shape[0]-1],
]
kpNeutral, kpSmiling = iM.loadKeyPoints(corners, keyPointsPath)

averageFaceNeutral = (
    sum([n.astype(np.float16) for n in imagesNeutral])
    / len(imagesNeutral)
).astype(np.uint8)

averageFaceSmiling = (
    sum([n.astype(np.float16) for n in imagesSmiling])
    / len(imagesSmiling)
).astype(np.uint8)

averageKpNeutral = sum(kpNeutral) / len(kpNeutral)
averageKpSmiling = sum(kpSmiling) / len(kpSmiling)

iM.plotResults([averageFaceNeutral, averageFaceSmiling])


###############################################################################
# Morphing with Means                                                         #
###############################################################################

tri = Delaunay(averageKpNeutral)
simplices = tri.simplices

morphedNeutral = []

for i in range(8):
    neutralFace = imagesNeutral[i]
    neutralKp = kpNeutral[i]
    res = gM.morphTris(neutralFace, neutralKp, averageKpNeutral,
                       simplices, np.zeros(averageFaceNeutral.shape), color=False)
    morphedNeutral.append(res.astype(np.uint8))

iM.visualizeMorphs(imagesNeutral, morphedNeutral, (2, 4))

###############################################################################
# Morphing my face to mean and morphing mean to my face                       #
###############################################################################

myFacePath = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project3/data/me2.jpeg"
myFaceKpPath = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project3/data/key_points/avg_me_keypoints.json"
myFace = skio.imread(myFacePath)

newKP = False
appendKP = True
if appendKP:
    # myFaceKp = np.array(gM.loadKeyPoints(myFaceKpPath))
    # averageKpNeutral, myFaceKp = gM.setKeyPoints(
    #         averageFaceNeutral, myFace,
    #         kp1=averageKpNeutral, kp2=myFaceKp
    # )
    avgFaceNeutralKpPath = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project3/data/key_points/avg_neutral_kp_modified.json"
    myFaceKpPath = "/Users/trustinnguyen/Downloads/Berkeley/Compsci/CS180/Projects/Project3/data/key_points/my_face_kp_modified.json"
    #
    # gM.saveKeyPoints(averageKpNeutral.tolist(), avgFaceNeutralKpPath)
    # gM.saveKeyPoints(myFaceKp.tolist(), myFaceKpPath)

    averageKpNeutral = np.array(gM.loadKeyPoints(avgFaceNeutralKpPath))
    myFaceKp = np.array(gM.loadKeyPoints(myFaceKpPath))

elif newKP:
    gM.setKeyPoints(img1=averageFaceNeutral, img2=myFace, kp1=averageKpNeutral)
    averageKpNeutral, myFaceKp = gM.setKeyPoints(
            averageFaceNeutral, myFace,
            kp1=averageKpNeutral
    )

else:
    myFaceKp = np.array(gM.loadKeyPoints(myFaceKpPath))

simplices = gM.computeMidwaySimplices(
        averageKpNeutral, myFaceKp,
)
# gM.visualizeKeyPoints(averageFaceNeutral, myFace, averageKpNeutral, myFaceKp)
# gM.visualizeDelauney(averageFaceNeutral, myFace, averageKpNeutral, myFaceKp, simplices)

myFaceToAvg = np.zeros((averageFaceNeutral.shape[0], averageFaceNeutral.shape[1], 3))
myFaceToAv = gM.morphTris(
        myFace, myFaceKp, averageKpNeutral,
        simplices, myFaceToAvg)

myGrayFace = rgb2gray(myFace)
avgToFace = np.zeros(myGrayFace.shape)
avgToFace = gM.morphTris(
        averageFaceNeutral, averageKpNeutral,
        myFaceKp, simplices, avgToFace, color=False)

# iM.plotResults(
#     [myFace, averageFaceNeutral],
#     [myFaceToAvg.astype(np.uint8), avgToFace.astype(np.uint8)],
# )

###############################################################################
# Making a caricature                                                         #
###############################################################################

myFaceToAvg = rgb2gray(myFaceToAvg)
alpha = -.4

caricature = iM.extrapolate(averageFaceNeutral, myFaceToAvg, alpha)
skio.imshow(caricature)
skio.show()

caricature = iM.extrapolate(myFaceToAvg, averageFaceNeutral, alpha)
skio.imshow(caricature)
skio.show()

print("done")
