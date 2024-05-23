import "./404.css";

import React from "react";

const Page404 = () => {
  return (
    <center className="center">
      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
                <div className="four_zero_four_bg">
                  <h1 className="text-center ">404</h1>
                </div>

                <div className="contant_box_404">
                  <h3 className="h2">On dirait que tu es perdu !</h3>

                  <p>la page recherchée n'est pas disponible  ou vous êtes!</p>

                  <a href="/admin/dashboard" className="link_404">
                  Aller au tableau de bord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </center>
  );
};

export default Page404;
