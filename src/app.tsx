import {
  createSignal,
  createEffect,
  For,
  Component,
  onMount,
  Suspense,
} from "solid-js";
import {
  globalStyle,
  createThemeContract,
  createTheme,
} from "@macaron-css/core";

import { styled } from "@macaron-css/solid";
import {
  RiDocumentFileAddFill,
  RiDocumentFileReduceFill,
  RiDeviceSave3Fill,
} from "solid-icons/ri";
import { FaSolidClose } from "solid-icons/fa";

const arr = [
  { site: "google.com", user: "User", password: "Password" },
  { site: "example.com", user: "ExampleUser", password: "ExamplePassword" },
];

export const App: Component = () => {
  globalStyle("body", {
    margin: 0,
    padding: 0,
    backgroundColor: "#2B2B2B",
  });
  const Header1Styled = styled("h1", {
    base: {
      marginTop: "2rem",
      color: "#FFF",
      fontFamily: "Arial, sans-serif",
      fontWeight: "normal",
      textAlign: "center",
    },
  });
  const ContainerStyled = styled("div", {
    base: {
      margin: "2rem auto",
      padding: "2rem",
      width: "70vw",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      backgroundColor: "#989898",
      borderRadius: "4px",
      boxSizing: "border-box",
    },
  });

  const FormStyled = styled("form", {
    base: {
      padding: "1rem",
      height: "2rem",
      display: "flex",
      gap: "1rem",
      justifyContent: "space-between",
      alignItems: "stretch",
      backgroundColor: "#676767",
      borderRadius: "4px",
    },
  });
  const LabelStyled = styled("label", {
    base: {
      width: "100%",
      position: "relative",
    },
  });
  const InputStyled = styled("input", {
    base: {
      padding: "0.5rem",
      width: "100%",
      height: "100%",
      color: "#2B2B2B",
      display: "block",
      backgroundColor: "#FFF",
      boxSizing: "border-box",
      border: "none",
      borderRadius: "4px",
      outline: "none",
    },
  });

  const ButtonStyled = styled("button", {
    base: {
      color: "#2B2B2B",
      display: "flex",
      alignItems: "center",
      fontSize: "1.5rem",
      cursor: "pointer",
      backgroundColor: "#D0D0D0",
      border: "none",
      borderRadius: "4px",
    },
  });
  const MenuStyled = styled("menu", {
    base: {
      margin: "0 auto",
      padding: "0",
    },
  });
  const ClearButtonStyled = styled("button", {
    base: {
      marginTop: "-0.5rem",
      position: "absolute",
      right: "0.5rem",
      top: "50%",
      background: "none",
      border: "none",
    },
  });
  const [entries, setEntries] = createSignal(arr);
  const formHandler = (e: Event) => {
    e.preventDefault();
  };
  const addRow = (index: number) => {
    const temp = entries();
    temp.splice(index + 1, 0, { site: "", user: "", password: "" });
    setEntries([...temp]);
  };
  const removeRow = (index: number) => {
    const temp = entries();
    if (temp.length === 1) {
      setEntries([{ site: "", user: "", password: "" }]);
      return;
    }
    temp.splice(index, 1);
    setEntries([...temp]);
  };
  const updateStorage = () => {
    let savedData = [];
    document.querySelectorAll("form").forEach((form, index) => {
      const site = (form.querySelectorAll("input")[0] as HTMLInputElement)
        .value;
      const user = (form.querySelectorAll("input")[1] as HTMLInputElement)
        .value;
      const password = (form.querySelectorAll("input")[2] as HTMLInputElement)
        .value;

      savedData.push({ site: site, user: user, password: password });
    });

    setEntries([...savedData]);
    console.log("saving data");
    if (chrome?.storage?.local) {
      chrome.storage.local
        .set({
          keys: entries(),
        })
        .then(() => {
          chrome.storage.local.get(["keys"]).then((result) => {
            console.log("Frontend: Stored keys:", result.keys);
          });
        });
    }
  };

  const clearField = (field: "site" | "user" | "password", index: number) => {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: "" };
      return updated;
    });
  };
  return (
    <>
      <Header1Styled> AutoAuth Options </Header1Styled>
      <ContainerStyled>
        <Suspense fallback={<div>Loading...</div>}>
          <For each={entries()}>
            {(item, i) => (
              <FormStyled onSubmit={formHandler}>
                <ButtonStyled
                  onClick={(e) => {
                    removeRow(i());
                  }}
                >
                  <RiDocumentFileReduceFill />
                </ButtonStyled>
                <LabelStyled>
                  <InputStyled
                    type="text"
                    placeholder="google.com"
                    value={item.site}
                    autocomplete="domain"
                  />
                  <ClearButtonStyled
                    onClick={(e) => {
                      clearField("site", i());
                    }}
                  >
                    <FaSolidClose />
                  </ClearButtonStyled>
                </LabelStyled>
                <LabelStyled>
                  <InputStyled
                    type="text"
                    placeholder="User"
                    value={item.user}
                    autocomplete="username"
                  />
                  <ClearButtonStyled
                    onClick={(e) => {
                      clearField("user", i());
                    }}
                  >
                    <FaSolidClose />
                  </ClearButtonStyled>
                </LabelStyled>
                <LabelStyled>
                  <InputStyled
                    type="password"
                    placeholder="Password"
                    value={item.password}
                    autocomplete="current-password"
                  />
                  <ClearButtonStyled
                    onClick={(e) => {
                      clearField("password", i());
                    }}
                  >
                    <FaSolidClose />
                  </ClearButtonStyled>
                </LabelStyled>
                <ButtonStyled
                  onClick={(e) => {
                    addRow(i());
                  }}
                >
                  <RiDocumentFileAddFill />
                </ButtonStyled>
              </FormStyled>
            )}
          </For>
        </Suspense>
        <MenuStyled>
          <ButtonStyled onClick={updateStorage}>
            SAVE <RiDeviceSave3Fill />
          </ButtonStyled>
        </MenuStyled>
      </ContainerStyled>
    </>
  );
};
