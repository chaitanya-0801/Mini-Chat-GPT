import { User, Share, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { generateLink, addAccess } from "../services/chatServices";
import toast from "react-hot-toast";
import { useSearchParams, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAddAccess, setShowAddAccess] = useState(false);
  const [emails, setEmails] = useState([""]);

  const menuRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setShowMenu(!showMenu);
    navigate("/login");
  };

  const generateLinkAndCopy = async () => {
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      toast.error("No chat selected.");
      return;
    }

    const toastId = toast.loading("Generating Link...");

    try {
      const res = await generateLink(chatId);

      if (res?.data?.success) {
        await navigator.clipboard.writeText(res.data.link);

        toast.success("Link Copied!", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Error while generating link!", {
        id: toastId,
      });

      console.error(error);
    }
  };
  const handleAddAccess = async () => {
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      toast.error("No chat selected.");
      return;
    }

    // Remove empty emails
    const validEmails = emails.map((email) => email.trim()).filter(Boolean);

    if (validEmails.length === 0) {
      toast.error("Please enter at least one email.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const invalidEmail = validEmails.find((email) => !emailRegex.test(email));

    if (invalidEmail) {
      toast.error(`${invalidEmail} is not a valid email.`);
      return;
    }

    const toastId = toast.loading("Updating Access...");

    try {
      const res = await addAccess(chatId, validEmails);

      if (res?.data?.success) {
        toast.success("Access Updated", {
          id: toastId,
        });

        (res.data.emailNotUpdated || []).forEach((email) => {
          toast.error(
            `${email} is not registered on the platform. Access not updated.`,
          );
        });

        console.log(res.data.emailNotUpdated )

        setEmails([""]);
        setShowAddAccess(false);
      } else {
        toast.error("Failed to update access.", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while updating access!",
        {
          id: toastId,
        },
      );
      console.error(error);
    }
  };

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  return (
    <nav className="flex h-16 items-center justify-end gap-3 border-b border-zinc-800 bg-zinc-950 px-6">
      {/* Share Button */}
      <button
        onClick={generateLinkAndCopy}
        className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-white transition hover:bg-zinc-800"
      >
        <Share size={18} />
        Share
      </button>
      <button
        onClick={() => setShowAddAccess((prev) => !prev)}
        className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-white transition hover:bg-zinc-800"
      >
        <Plus size={18} />
        Add Access
      </button>
      {showAddAccess && (
        <div className="absolute right-50 top-15 mt-2 w-40 rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-xl text-white">
          <h2 className="mb-3 font-semibold">Give Access</h2>

          {emails.map((email, index) => (
            <input
              key={index}
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              className="mb-2 w-full rounded-lg border border-zinc-600 bg-transparent p-2 outline-none"
            />
          ))}

          <button
            onClick={addEmailField}
            className="mb-3 flex items-center gap-2 rounded-lg border px-3 py-2 hover:bg-zinc-800"
          >
            <Plus size={18} />
            Add Email
          </button>

          <button
            onClick={handleAddAccess}
            className="w-full rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            Add Access
          </button>
        </div>
      )}

      {/* Profile */}
      {user ? (
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setShowMenu((prev) => !prev)}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 transition hover:bg-zinc-800"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name,
              )}&background=2563eb&color=fff`}
              alt={user.name}
              className="h-10 w-10 rounded-full"
            />

            <div>
              <p className="text-sm font-semibold text-white">{user.name}</p>

              <p className="text-xs text-zinc-400">{user.email}</p>
            </div>
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-xl">
              <button
                onClick={handleLogout}
                className="w-full rounded-lg px-4 py-2 text-left text-red-500 transition hover:bg-zinc-800"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-white hover:bg-zinc-900"
        >
          <User size={18} />
          Login
        </button>
      )}
    </nav>
  );
};

export default Navbar;
