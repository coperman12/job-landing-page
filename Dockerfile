# Build the .NET server
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY server/LandingPage.Server.csproj server/
RUN dotnet restore server/LandingPage.Server.csproj
COPY server/ server/
RUN dotnet publish server/LandingPage.Server.csproj -c Release -o /out --no-restore

# Runtime: the published server plus the public site files only
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /out .
COPY index.html /site/
COPY styles/ /site/styles/
COPY images/ /site/images/
COPY scripts/dist/ /site/scripts/dist/
ENV Site__Root=/site
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "LandingPage.Server.dll"]
