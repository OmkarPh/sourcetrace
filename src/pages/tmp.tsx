CreateProducerFn(
  metaState.account[0],
  info.name,
  info.phoneno,
  info.regno,
  info.address
).then(res => {
  toast.success("Registered successfuly !");
  setProcessing(false);
  refreshAuthStatus();
  router.push(DASHBOARD);
})
.catch(err => {
  toast.error(<>Please approve metamask tx</>);
  setProcessing(false);
})