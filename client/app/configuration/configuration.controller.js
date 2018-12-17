angular
  .module('App')
  .controller(
    'configurationCtrl',
    class ConfigurationCtrl {
      constructor(
        $route,
        $scope,

        constants,
        User,
        WucProducts,
      ) {
        this.$route = $route;
        this.$scope = $scope;

        this.constants = constants;
        this.User = User;
        this.WucProducts = WucProducts;
      }

      $onInit() {
        this.guides = this.constants.TOP_GUIDES;

        this.currentGuides = [];
        this.currentTypeOfGuide = null;

        this.selectTypeOfGuide('domainHosting');

        this.helpCenterURLs = Object.keys(this.constants.urls)
          .reduce(
            (previousValue, currentSubsidiaryName) => (_.has(this.constants.urls[currentSubsidiaryName], 'support')
              ? Object.assign(
                {},
                previousValue,
                { [currentSubsidiaryName]: this.constants.urls[currentSubsidiaryName].support },
              )
              : previousValue),
            {},
          );

        return this.User
          .getUser()
          .then(({ ovhSubsidiary: subsidiary }) => {
            this.subsidiary = subsidiary;

            this.allGuides = _.get(
              this.constants,
              `urls.${subsidiary}.guides.all`,
              this.constants.urls.FR.guides.all,
            );
          })
          .catch(() => {
            this.allGuides = this.constants.urls.FR.guides.all;
          })
          .then(() => this.unSelectProduct());
      }

      unSelectProduct() {
        return this.WucProducts
          .removeSelectedProduct()
          .then((p) => {
            this.$scope.product = p;
          });
      }

      selectTypeOfGuide(typeOfGuide) {
        this.currentGuides = this.guides[typeOfGuide];
        this.currentTypeOfGuide = typeOfGuide;
      }
    },
  );
