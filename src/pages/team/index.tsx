import { type NextPage } from "next";

import TeamCard from "~/components/general/about/teamCard";

const Team: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col gap-y-8 bg-transparent pb-10 pt-32">
      <div className="px-4">
        <h1
          className={`text-center font-PressStart text-2xl font-bold text-white lg:text-4xl`}
        >
          Incridea&apos;s Technical Team
        </h1>
        <p className="mt-5 text-center text-lg font-bold text-white lg:text-2xl">
          Meet the developers
        </p>
      </div>
      <div className="mx-auto flex max-w-[80rem] flex-wrap justify-center gap-10 px-2">
        {TeamMembers.map((member) => (
          <TeamCard
            key={member.name}
            name={member.name}
            role={member.role}
            image={member.image}
            linkedin={member.linkedin}
            instagram={member.instagram}
            github={member.github}
            quote={member.quote}
            avatar={member.avatar}
          />
        ))}
      </div>
    </div>
  );
};

export default Team;

const TeamMembers = [
  {
    name: "Satwik Prabhu",
    role: "Team Lead | Full Stack",
    instagram: "https://www.instagram.com/satwikprabhu",
    github: "https://github.com/satwikrprabhu",
    linkedin: "https://www.linkedin.com/in/satwikprabhu",
    image: "/2025/team/satwik-prabhu.jpg",
    quote: "I know where you live!",
    avatar: "",
  },
  {
    name: "A Omkar G Prabhu",
    role: "Backend",
    instagram: "-",
    github: "https://github.com/Prabhuomkar9",
    linkedin: "https://www.linkedin.com/in/prabhuomkar9/",
    image: "/2025/team/omkar.jpg", //YET TO SEND
    quote: "Control yourself, Not others!",
    avatar: "",
  },
  {
    name: "Nandan R Pai",
    role: "Full Stack",
    instagram: "https://www.instagram.com/nandanpi__/",
    github: "https://github.com/nandanpi",
    linkedin: "https://www.linkedin.com/in/nandanpai09",
    image: "/2025/team/nandan.jpg", //YET TO SEND
    quote: "My touch is the solution to all problems 🥰",
    avatar: "",
  },
  {
    name: "Athul D Bhandary",
    role: "Full Stack",
    instagram: "https://www.instagram.com/athul_bhandary?igsh=cWs0cTVldzAwdXg1",
    github: "https://github.com/athul28",
    linkedin: "https://www.linkedin.com/in/athul-d-bhandary-0b1912247/",
    image: "/2025/team/athul_d_bhandary.jpg",
    quote: "Hey wassup!!!",
    avatar: "",
  },
  {
    name: "M Sayeem Ahmed",
    role: "Backend",
    instagram: "https://www.instagram.com/ahmedmsayeem/",
    github: "https://github.com/ahmedmsayeem",
    linkedin: "https://www.linkedin.com/in/m-sayeem-ahmed-651a7b254",
    image: "/2025/team/sayeem_ahmed.jpg",
    quote: "Konnichiwa",
    avatar: "",
  },
  {
    name: "Samarth H Shetty",
    role: "Full Stack",
    instagram: "https://www.instagram.com/sammonster1920/",
    github: "https://github.com/Sammonster495",
    linkedin: "https://www.linkedin.com/in/samarth-shetty-a53018247/",
    image: "/2025/team/samarth.jpg",  //YET TO SEND
    quote: "Coding and dancing my way through life",
    avatar: "",
  },
  {
    name: "Pratham A Kadekar",
    role: "Full Stack",
    instagram: "https://www.instagram.com/pratham_ak2004?igsh=dHh5NWJleTUzZnM2",
    github: "https://github.com/pratham-ak2004",
    linkedin: "https://www.linkedin.com/in/pratham-a-kadekar-8397a7249?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    image: "/2025/team/prataham_a_kadekar.jpg",  //YET TO SEND
    quote: "Kon'nichiwa",
    avatar: "",
  },
  {
    name: "Snehal Shetty",
    role: "Full Stack",
    instagram: "https://www.instagram.com/shettysnehal__05",
    github: "https://github.com/shettysnehal",
    linkedin: "https://www.linkedin.com/in/snehalshetty105",
    image: "/2025/team/snehal_shetty.jpeg",
    quote: "Life so cooked that my luck is on airplane mode",
    avatar: "",
  },
  {
    name: "Chaithra S Nayak",
    role: "Backend",
    instagram: "https://www.instagram.com/chaithrasnayak3/",
    github: "https://github.com/Chaithra-S-Nayak",
    linkedin: "https://www.linkedin.com/in/chaithra-s-nayak/",
    image: "/2025/team/chaitra.jpeg", //YET TO SEND
    quote: "git commit, git push, git regret",
    avatar: "",
  },
  {
    name: "Len Mendonca",
    role: "Frontend",
    instagram: "https://www.instagram.com/lendanieo/",
    github: "https://github.com/len-mendonca",
    linkedin: "https://in.linkedin.com/in/len-mendonca",
    image: "/2025/team/len_mendonca.png", 
    quote: "Maria Pitache",
    avatar: "",
  },
  {
    name: "Keerthan K",
    role: "Full Stack",
    instagram: "https://www.instagram.com/keetha_k11",
    github: "https://github.com/keetha1011",
    linkedin: "https://www.linkedin.com/in/kkeerthan/",
    image: "/2025/team/keerthan_k.jpg",
    quote: "passion && :) >>>",
    avatar: "",
  },
  {
    name: "Rahul N Bangera",
    role: "Full Stack",
    instagram: "https://www.instagram.com/rahul_n_bangera",
    github: "https://github.com/Bnir",
    linkedin: "https://www.linkedin.com/in/rahul-n-bangera",
    image: "/2025/team/rahul.jpg", //YET TO SEND
    quote: "Give 200% or Give nothing",
    avatar: "",
  },
  {
    name: "Ashton Prince Mathias",
    role: "Frontend",
    instagram: "https://www.instagram.com/_ashtonmathias_/",
    github: "https://github.com/Subtilizer28",
    linkedin: "https://www.linkedin.com/in/ashtonmths/",
    image: "/2025/team/ashton_mathias.jpg",
    quote: '"your fone linging 📞"',
    avatar: "",
  },
  {
    name: "Riyaz Ahmed",
    role: "Frontend",
    instagram: "https://www.instagram.com/ria_yz24",
    github: "https://github.com/RiaAug24",
    linkedin: "https://www.linkedin.com/in/riyaz-ahmed24",
    image: "/2025/team/riyaz_ahmed.jpg",
    quote: "Try to be the fitting piece, for a missing piece. 🧩",
    avatar: "",
  },
  {
    name: "Gaurav Dhanraja ",
    role: "Frontend",
    instagram: "https://instagram.com/gaurav.dhanraja",
    github: "https://github.com/gauravdhanraja",
    linkedin: "https://linkedin.com/in/gauravdhanraja",
    image: "/2025/team/gaurav_dhanraja.jpg",
    quote: "Ishan's a stalker",
    avatar: "",
  },
  {
    name: "Prakash Waddar",
    role: "Frontend",
    instagram: "https://www.instagram.com/prakash___28__/",
    github: "https://github.com/prakashwaddar628",
    linkedin: "https://www.linkedin.com/in/prakash-l-waddar-422760203?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    image: "/2025/team/prakash_waddar.jpg",
    quote: "Break loops, not your spirit. Go beyond your limits",
    avatar: "",
  },

  
  {
    name: "Karthik P K",
    role: "Backend",
    instagram: "https://www.instagram.com/_karthik_p_k/",
    github: "https://github.com/karthikpk-o",
    linkedin:
      "https://linkedin.com/in/karthik-p-k",
    image: "/2025/team/karthik_p_k.jpg",
    quote:
      "The trouble is, you think you have time.",
    avatar: "",
  },
  
  {
    name: "Mustafa",
    role: "Frontend",
    instagram: "https://www.instagram.com/mustafa._._.raza/",
    github: "https://github.com/Mustafa-DEV0",
    linkedin: "https://www.linkedin.com/in/mustafa-raza-b98163350?trk=contact-info",
    image: "/2025/team/mustafa.jpeg",
    quote: "I write clean code… until the deadline says otherwise.",
    avatar: "",
  },

];
